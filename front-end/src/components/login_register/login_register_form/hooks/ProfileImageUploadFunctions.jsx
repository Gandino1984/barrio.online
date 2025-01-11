import { useContext, useState } from 'react';
import AppContext from '../../../../app_context/AppContext.js';
import axiosInstance from '../../../../../utils/axiosConfig.js';

export const ProfileImageUploadFunctions = () => {
    const { 
        currentUser, 
        setCurrentUser, 
        setError,
        setIsUploading 
    } = useContext(AppContext);

    const validateImage = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!file) {
            throw new Error('No se ha seleccionado ningún archivo');
        }

        if (!allowedTypes.includes(file.type)) {
            throw new Error('Formato de imagen no válido. Use JPG, PNG, GIF o WebP.');
        }

        if (file.size > maxSize) {
            throw new Error('La imagen no debe superar 2MB.');
        }

        return true;
    };

    const processImage = async (file) => {
        if (!currentUser?.id) {
            throw new Error('Usuario no identificado. Por favor, inicie sesión nuevamente.');
        }

        const formData = new FormData();
        formData.append('profileImage', file);
        formData.append('userId', currentUser.id);

        try {
            const response = await axiosInstance.post('/user/upload-profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 10000 // 10 second timeout
            });

            if (!response.data) {
                throw new Error('No se recibió respuesta del servidor');
            }

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response;
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('La solicitud ha tardado demasiado. Por favor, inténtelo de nuevo.');
            }
            
            const errorMessage = error.response?.data?.message || error.message;
            throw new Error(`Error al procesar la imagen: ${errorMessage}`);
        }
    };

    const handleImageUpload = async (event) => {
        // Clear any previous errors
        setError(prevError => ({ ...prevError, imageError: '' }));
        
        try {
            const file = event.target.files[0];
            
            // Validate the file
            validateImage(file);
            
            // Set uploading state
            setIsUploading(true);

            // Process the image
            const response = await processImage(file);

            // Update user data with new image URL
            if (response.data?.data?.imageUrl) {
                setCurrentUser(prevUser => ({
                    ...prevUser,
                    imageUrl: response.data.data.imageUrl
                }));

                // Update localStorage
                const storedUser = JSON.parse(localStorage.getItem('currentUser'));
                if (storedUser) {
                    localStorage.setItem('currentUser', JSON.stringify({
                        ...storedUser,
                        imageUrl: response.data.data.imageUrl
                    }));
                }
            } else {
                throw new Error('No se recibió la URL de la imagen del servidor');
            }

        } catch (err) {
            console.error('Error in image upload:', err);
            
            setError(prevError => ({
                ...prevError,
                imageError: err.message || 'Error al subir la imagen de perfil'
            }));

            // Reset file input
            if (event.target) {
                event.target.value = '';
            }
        } finally {
            setIsUploading(false);
        }
    };

    return {
        handleImageUpload,
    };
};