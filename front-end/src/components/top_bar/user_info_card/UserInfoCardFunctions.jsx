import  { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import axiosInstance from '../../../../utils/axiosConfig.js';

export const UserInfoCardFunctions = () => {
    const {
        currentUser, setCurrentUser,
        setUploading,
        setError,
    } = useContext(AppContext);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        
        if (!file) { 
            console.error('-> UserInfoCardFunctions - handleImageUpload() - No se ha seleccionado un archivo');
            setError(prevError => ({ ...prevError, imageError: "Error al subir el archivo" })); 
            return;
        }
    
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            console.error('-> UserInfoCardFunctions - handleImageUpload() - Tipo de archivo no permitido');
            setError(prevError => ({ 
                ...prevError, 
                imageError: "Tipo de archivo no permitido. Solo se permiten archivos JPG, JPEG, PNG o WebP" 
            }));
            return;
        }
    
        // Check file size (assuming 5MB limit - adjust as needed)
        const MAX_SIZE = 2 * 1024 * 1024; // 2MB in bytes
        if (file.size > MAX_SIZE) {
            console.error('-> UserInfoCardFunctions - handleImageUpload() - Archivo demasiado grande');
            setError(prevError => ({ 
                ...prevError, 
                imageError: "El tamaño máximo de imagen es 2MB. Intenta subir una en formato .webp" 
            }));
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
                setCurrentUser(updatedUser);
            }
        } catch (err) {
            console.error('-> UserInfoCardFunctions - handleImageUpload() - Upload error = ', err.response?.data || err);
            
            // Handle specific backend errors
            if (err.response?.data?.error) {
                setError(prevError => ({ 
                    ...prevError, 
                    imageError: err.response.data.error 
                }));
            } else {
                setError(prevError => ({ 
                    ...prevError, 
                    imageError: "Error al subir el archivo. Por favor, inténtalo de nuevo" 
                }));
            }
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