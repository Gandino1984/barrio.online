import { useContext, useState } from 'react';
import AppContext from '../../../../app_context/AppContext.js';
import axiosInstance from '../../../../../utils/axiosConfig.js';

export const ProfileImageUploadFunctions = () => {
    const { 
        currentUser, setCurrentUser, 
        setError,
        setIsUploading 
    } = useContext(AppContext);

    const processImage = async (file) => {
        const formData = new FormData();
        formData.append('profileImage', file);
        formData.append('userId', currentUser.id);

        return await axiosInstance.post('/user/upload-profile-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    };

    const validateImage = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!allowedTypes.includes(file.type)) {
            console.error('-> ProfileImageUploadFunctions.jsx - validateImage() - Formato de imagen no válido');
            setError(prevError => ({
                ...prevError,
                imageError: 'Formato de imagen no válido. Use JPG, PNG, GIF o WebP.'
            }))
            throw new Error('Formato de imagen no válido. Use JPG, PNG, GIF o WebP.');
        }

        if (file.size > maxSize) {
            console.error('-> ProfileImageUploadFunctions.jsx - validateImage() - La imagen no debe superar 2MB');
            setError(prevError => ({
                ...prevError,
                imageError: 'La imagen no debe superar 2MB.'
            }))
            throw new Error('La imagen no debe superar 2MB.');
        }

        return true;
    };

    const handleImageUpload = async (event) => {
        try {
            const file = event.target.files[0];
            if (!file) return;

            validateImage(file);
            setIsUploading(true);

            const response = await processImage(file);

            if (response.data.error) {
                console.error('-> ProfileImageUploadFunctions.jsx - handleImageUpload() - Error uploading profile image:', response.data.error);
                setError(prevError => ({
                    ...prevError,
                    imageError: "Error al subir la imagen de perfil"
                }))
                throw new Error(response.data.error);
            }

            setCurrentUser({
                ...currentUser,
                imageUrl: response.data.data.imageUrl
            });

        } catch (err) {
            console.error('Error uploading profile image:', err);
            setError(prevError => ({
                ...prevError,
                imageError: 'Error al subir la imagen de perfil'
            }));
        } finally {
            setIsUploading(false);
        }
    };

    return {
        handleImageUpload,
    };
};