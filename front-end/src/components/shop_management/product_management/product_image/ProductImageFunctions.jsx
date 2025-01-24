import axiosInstance from '../../../../../utils/axiosConfig.js';
import { validateImageFile } from '../../../../../utils/imageValidation.js';
import { useContext } from 'react';
import AppContext from '../../../../app_context/AppContext.js';

export const ProductImageFunctions = () => {

    const { selectedShop } = useContext(AppContext);


    const handleProductImageUpload = async (file, product_id, setError, setUploading) => {

       if (!selectedShop || !selectedShop.shop_name) {
        setError(prevError => ({ 
            ...prevError, 
            imageError: "No shop selected" 
        }));
        return;
    }
        
        if (!file) {
            console.error('No file selected');
            setError(prevError => ({ ...prevError, imageError: "Error uploading file" }));
            return;
        }
    
        try {
            await validateImageFile(file);
    
            const formData = new FormData();
            formData.append('productImage', file);
            
            // IMPORTANT: Append these as strings, not objects
            formData.append('product_id', String(product_id)); 
            formData.append('shop_name', String(selectedShop.shop_name));
    
             // Debug logging
            console.log('FormData Submission:', {
                file: file.name,
                product_id: String(product_id),
                shop_name: String(selectedShop.shop_name)
            });
    
            setUploading(true);
    
            const response = await axiosInstance.post(
                '/product/upload-product-image',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        // Optional: Add additional headers for redundancy
                        'product_id': String(product_id),
                        'shop_name': String(selectedShop.shop_name)
                    },
                }
            );
    
            if (response.data.data?.image_product) {
                return response.data.data.image_product;
            }
        } catch (err) {
            console.error('Upload error:', err.response ? err.response.data : err);
            setError(prevError => ({
                ...prevError,
                imageError: err.response?.data?.error || err.message || "Error uploading file"
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