import  { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import axiosInstance from '../../../../utils/axiosConfig.js';

export const UserInfoCardFunctions = () => {
    const {
        currentUser,
        setCurrentUser,
        setUploading,
        setError,
        clearError
    } = useContext(AppContext);

    const handleImageUpload = async (event) => {

        const file = event.target.files[0];
        
        if (!file) { 
            console.error('-> UserInfoCardFunctions - handleImageUpload() - No se ha seleccionado un archivo');
            setError(prevError => ({ ...prevError, imageError: "Error al subir el archivo" })); 
            return;
        }
    
        if (!currentUser || !currentUser.name_user) {
            console.error('-> UserInfoCardFunctions - handleImageUpload() - No hay usuario activo = ', currentUser);
            setError(prevError => ({ ...prevError, userError: "Error al subir el archivo: no hay usuario activo" }));
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
            }
        } catch (err) {
            console.error('-> UserInfoCardFunctions - handleImageUpload() - Upload error = ', err.response?.data || err);
            setError(prevError => ({ ...prevError, imageError: "Error al subir el archivo" }));
        } finally {
            setUploading(false);
        }
        };

    const getImageUrl = (imagePath) => {
        if (!imagePath) 
        {
            console.error('-> UserInfoCardFunctions - getImageUrl() - No se ha proporcionado una ruta de imagen');
            setError(prevError => ({ ...prevError, imageError: "No se ha proporcionado una ruta de imagen" }));
            return null;
        }
            
        // Remove any leading slashes and ensure proper path
        const cleanPath = imagePath.replace(/^\/+/, '');
        // If using axiosInstance base URL
        const baseUrl = axiosInstance.defaults.baseURL || '';

        console.log('-> UserInfoCardFunctions - getImageUrl() - URL base de Axios = ', baseUrl);

        const imageUrl = `${baseUrl}/${cleanPath}`.replace(/([^:]\/)(\/)+/g, "$1");
        
        console.log('-> UserInfoCardFunctions - getImageUrl() - URL construida de la imagen = ', imageUrl); 
        return imageUrl;
      };

   
    return {
        getImageUrl,
        handleImageUpload
    };
};