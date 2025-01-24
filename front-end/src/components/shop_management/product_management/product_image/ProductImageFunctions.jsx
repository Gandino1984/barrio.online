import { validateImageFile } from '../../../../../utils/imageValidation.js';
import axiosInstance from '../../../../../utils/axiosConfig.js';

export const ProductImageFunctions = () => {
    const handleProductImageUpload = async (file, id_product, setError, setUploading) => {
        const formData = new FormData();
        formData.append('productImage', file, file.name);
        formData.append('id_product', id_product);
    
        try {
            const response = await axiosInstance.post('/product/upload-product-image', formData, {
                headers: {
                    'X-Product-ID': id_product,
                    // Ensure unique boundary for multipart form data
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
                }
            });
    
            return response.data.data.image_url;
        } catch (err) {
            console.error('Comprehensive Upload Error:', {
                response: err.response,
                request: err.request,
                message: err.message
            });
    
            setError(prevError => ({
                ...prevError,
                imageError: err.response?.data?.error || "Unexpected upload error"
            }));
    
            return null;
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