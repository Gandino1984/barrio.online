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
<<<<<<< HEAD
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
=======
        const allowedTypes = ['image/jpeg','image/jpg', 'image/png', 'image/gif', 'image/webp'];
>>>>>>> e080c1a (dev16 rebase)
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

<<<<<<< HEAD
    const compressImage = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
=======
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
>>>>>>> e080c1a (dev16 rebase)
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
<<<<<<< HEAD
                    
                    // Reduce maximum dimension to 600px for faster upload
                    let width = img.width;
                    let height = img.height;
                    const maxDimension = 600;
                    
=======
                    const maxDimension = 600;
                    let width = img.width;
                    let height = img.height;

>>>>>>> e080c1a (dev16 rebase)
                    if (width > height && width > maxDimension) {
                        height = (height * maxDimension) / width;
                        width = maxDimension;
                    } else if (height > maxDimension) {
                        width = (width * maxDimension) / height;
                        height = maxDimension;
                    }
<<<<<<< HEAD
                    
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
=======

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Error al comprimir la imagen')); 
                        }
                    }, 'image/jpeg', 0.8);
                };
                img.onerror = (error) => reject(new Error('Error al cargar la imagen: ' + error));
            };
            reader.onerror = (error) => reject(new Error('Error al leer el archivo: ' + error));
            reader.readAsDataURL(file);
>>>>>>> e080c1a (dev16 rebase)
        });
    };

    const processImage = async (file) => {
        const userData = typeof currentUser === 'string' 
            ? JSON.parse(currentUser) 
            : currentUser;
<<<<<<< HEAD
    
        if (!userData?.id_user) {
            throw new Error('Usuario no identificado. Por favor, inicie sesión nuevamente.');
        }
    
=======

        if (!userData?.id_user) {
            throw new Error('Usuario no identificado. Por favor, inicie sesión nuevamente.');
        }

        // Log image details before processing
        console.log('Uploading image:', { name: file.name, size: file.size, type: file.type });

>>>>>>> e080c1a (dev16 rebase)
        const compressedFile = await compressImage(file);
        const formData = new FormData();
        formData.append('profileImage', compressedFile);
        formData.append('userId', userData.id_user);
<<<<<<< HEAD
    
        // Create custom axios instance with specific timeout
=======

>>>>>>> e080c1a (dev16 rebase)
        const customAxiosInstance = axiosInstance.create({
            timeout: 15000 // 15 seconds timeout
        });

        try {
<<<<<<< HEAD
            // First attempt with shorter timeout
=======
>>>>>>> e080c1a (dev16 rebase)
            const response = await customAxiosInstance.post('/user/upload-profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
<<<<<<< HEAD
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
=======
            });
            return response;
        } catch (error) {
            console.error('Error in image upload:', error);
            console.error('Error details:', error.response ? error.response.data : error.message);
            throw new Error('Error al procesar la imagen: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
>>>>>>> e080c1a (dev16 rebase)
        }
    };

    const handleImageUpload = async (event) => {
        setError(prevError => ({ ...prevError, imageError: '' }));
        
<<<<<<< HEAD
        try {
            const file = event.target.files[0];
=======
        const file = event.target.files[0];
        console.log('Uploading image:', file);

        if (!file) {
            console.error('No file selected');
            return;
        }

        try {
>>>>>>> e080c1a (dev16 rebase)
            validateImage(file);
            setIsUploading(true);

            const response = await processImage(file);
<<<<<<< HEAD
=======
            console.log('Upload successful:', response.data);
>>>>>>> e080c1a (dev16 rebase)

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