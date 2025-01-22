import axiosInstance from '../../../../../utils/axiosConfig.js';
import { validateImageFile } from '../../../../../utils/imageValidation.js';

export const ProductImageFunctions = () => {
    const handleProductImageUpload = async (file, productId, setError, setUploading) => {
        setError(prevError => ({ ...prevError, imageError: "" }));
        
        if (!file) {
            console.error('No file selected');
            setError(prevError => ({ ...prevError, imageError: "Error uploading file" }));
            return;
        }

        try {
            await validateImageFile(file);

            const formData = new FormData();
            formData.append('productImage', file);
            formData.append('productId', productId);

            setUploading(true);

            const response = await axiosInstance.post('/products/upload-product-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                return response.data.data.image_url;
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(prevError => ({
                ...prevError,
                imageError: err.message || "Error uploading file"
            }));
            throw err;
        } finally {
            setUploading(false);
        }
    };

    const getProductImageUrl = (imagePath) => {
        if (!imagePath) {
            console.error('No image path provided');
            return null;
        }
            
        const cleanPath = imagePath.replace(/^\/+/, '');
        const baseUrl = axiosInstance.defaults.baseURL || '';
        const imageUrl = `${baseUrl}/${cleanPath}`.replace(/([^:]\/)(\/)+/g, "$1");
        
        return imageUrl;
    };

    return {
        handleProductImageUpload,
        getProductImageUrl
    };
};