import axiosInstance from '../../../../../utils/axiosConfig.js';
import { validateImageFile } from '../../../../../utils/imageValidation.js';
import { useContext } from 'react';
import AppContext from '../../../../app_context/AppContext.js';

export const ProductImageFunctions = () => {
  const { 
    selectedShop, 
    selectedProductForImageUpload,
    setError,
    setUploading
  } = useContext(AppContext);

  const handleProductImageUpload = async (event) => {
    const file = event.target.files[0];
  
    setError(prevError => ({ ...prevError, imageError: "" }));
  
    if (!file) {
      console.error('-> ProductImageFunctions - handleProductImageUpload() - No file selected');
      setError(prevError => ({ ...prevError, imageError: "Error uploading file" }));
      return;
    }
  
    // Log selectedShop and selectedProductForImageUpload
    console.log('Selected Shop:', selectedShop);
    console.log('Selected Product ID:', selectedProductForImageUpload);
  
    if (!selectedProductForImageUpload) {
      console.error('-> ProductImageFunctions - handleProductImageUpload() - No product selected for image upload');
      setError(prevError => ({ ...prevError, imageError: "No product selected" }));
      return;
    }
  
    if (!selectedShop?.name_shop) {
      console.error('-> ProductImageFunctions - handleProductImageUpload() - No shop selected');
      setError(prevError => ({ ...prevError, imageError: "No shop selected" }));
      return;
    }
  
    try {
      await validateImageFile(file);
  
      const formData = new FormData();
      formData.append('productImage', file); // Append the file
      formData.append('id_product', selectedProductForImageUpload); // Add product ID to the body
      formData.append('name_shop', selectedShop.name_shop); // Add shop name to the body
  
      setUploading(true);
  
      const response = await axiosInstance.post(
        '/product/upload-product-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.data.data?.image_product) {
        return response.data.data.image_product;
      }
    } catch (err) {
      console.error('-> ProductImageFunctions - handleProductImageUpload() - Upload error:', err.response ? err.response.data : err);
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
      console.warn('-> ProductImageFunctions - getProductImageUrl() - No hay ruta de imagen proporcionada');
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