import { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import axiosInstance from '../../../../utils/axiosConfig.js';

export const ProfileImageUploadFunctions = () => {
    const { 
        currentUser, 
        setCurrentUser, 
        setError,
        setIsUploading 
    } = useContext(AppContext);

    const validateImage = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 1 * 1024 * 1024; // Reduced to 1MB for faster upload

        if (!file) {
            throw new Error('No se ha seleccionado ningún archivo');
        }

        if (!allowedTypes.includes(file.type)) {
            throw new Error('Formato de imagen no válido. Use JPG, PNG, GIF o WebP.');
        }

        if (file.size > maxSize) {
            throw new Error('La imagen no debe superar 1MB.');
        }

        return true;
    };

    const compressImage = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Reduce maximum dimension to 600px for faster upload
                    let width = img.width;
                    let height = img.height;
                    const maxDimension = 600;
                    
                    if (width > height && width > maxDimension) {
                        height = (height * maxDimension) / width;
                        width = maxDimension;
                    } else if (height > maxDimension) {
                        width = (width * maxDimension) / height;
                        height = maxDimension;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob(
                        (blob) => {
                            resolve(new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            }));
                        },
                        'image/jpeg',
                        0.6 // Increased compression
                    );
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    };

    const processImage = async (file) => {
        const userData = typeof currentUser === 'string' 
            ? JSON.parse(currentUser) 
            : currentUser;
    
        if (!userData?.id_user) {
            throw new Error('Usuario no identificado. Por favor, inicie sesión nuevamente.');
        }
    
        const compressedFile = await compressImage(file);
        const formData = new FormData();
        formData.append('profileImage', compressedFile);
        formData.append('userId', userData.id_user);
    
        // Create custom axios instance with specific timeout
        const customAxiosInstance = axiosInstance.create({
            timeout: 15000 // 15 seconds timeout
        });

        try {
            // First attempt with shorter timeout
            const response = await customAxiosInstance.post('/user/upload-profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(`Upload Progress: ${percentCompleted}%`);
                }
            });

            if (!response.data) {
                throw new Error('No se recibió respuesta del servidor');
            }

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response;

        } catch (error) {
            // Handle specific error types
            if (error.code === 'ECONNABORTED') {
                throw new Error('La conexión ha tardado demasiado. Por favor, intente con una imagen más pequeña o verifique su conexión.');
            }
            
            if (error.response?.status === 413) {
                throw new Error('La imagen es demasiado grande. Por favor, seleccione una imagen más pequeña.');
            }

            const errorMessage = error.response?.data?.message || error.message;
            throw new Error(`Error al procesar la imagen: ${errorMessage}`);
        }
    };

    const handleImageUpload = async (event) => {
        setError(prevError => ({ ...prevError, imageError: '' }));
        
        try {
            const file = event.target.files[0];
            validateImage(file);
            setIsUploading(true);

            const response = await processImage(file);

            if (response.data?.data?.imageUrl) {
                const updatedUserData = {
                    ...currentUser,
                    imageUrl: response.data.data.imageUrl
                };
                
                setCurrentUser(updatedUserData);
                localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
            } else {
                throw new Error('No se recibió la URL de la imagen del servidor');
            }

        } catch (err) {
            console.error('Error in image upload:', err);
            setError(prevError => ({
                ...prevError,
                imageError: err.message || 'Error al subir la imagen de perfil'
            }));
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