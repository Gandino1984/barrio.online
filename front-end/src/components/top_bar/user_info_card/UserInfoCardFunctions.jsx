import  { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import axiosInstance from '../../../../utils/axiosConfig.js';

export const UserInfoCardFunctions = () => {
    const {
        currentUser,
        setCurrentUser,
        setImageError,
        setUploading
    } = useContext(AppContext);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        // Remove any leading slashes and ensure proper path
        const cleanPath = imagePath.replace(/^\/+/, '');
        // If using axiosInstance base URL
        const baseUrl = axiosInstance.defaults.baseURL || '';

        console.log('-> UserInfoCardFunctions - getImageUrl() - URL base de Axios = ', baseUrl);

        const imageUrl = `${baseUrl}/${cleanPath}`.replace(/([^:]\/)(\/)+/g, "$1");
        
        console.log('-> UserInfoCardFunctions - getImageUrl() - URL construida de la imagen = ', imageUrl); 
        
        return imageUrl;
      };

    const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!currentUser || !currentUser.name_user) {
        console.error('-> UserInfoCardFunctions - handleImageUpload() - No hay usuario activo = ', currentUser);
        return;
    }

    const formData = new FormData();

    formData.append('name_user', currentUser.name_user);
    formData.append('profileImage', file);

    try {
        setUploading(true);

        const response = await axiosInstance.post('/user/upload-profile-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        });

        if (response.data.data?.image_user) {
        const updatedUser = {
            ...currentUser,
            image_user: response.data.data.image_user
        };

        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        console.log('-> UserInfoCardFunctions - handleImageUpload() - Datos de usuario actualizados = ', updatedUser); 
        
        console.log('-> UserInfoCardFunctions - handleImageUpload() - Local Storage = ', localStorage.getItem('currentUser')); 
        
        setCurrentUser(updatedUser);
        
        setImageError(false);
        }
    } catch (err) {
        console.error('-> UserInfoCardFunctions - handleImageUpload() - Upload error = ', err.response?.data || err);
        setImageError(true);
    } finally {
        setUploading(false);
    }
    };
   
    return {
        getImageUrl,
        handleImageUpload
    };
};