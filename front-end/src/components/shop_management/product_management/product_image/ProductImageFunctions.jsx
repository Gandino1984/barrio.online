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
  
      setUploading(true);
  
      const response = await axiosInstance.post(
        '/product/upload-product-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Shop-Name': selectedShop.name_shop, // Pass shop name in headers
            'X-Product-ID': selectedProductForImageUpload, // Pass product ID in headers
          },
        }
      );


console.log('Upload Response:', response.data); // Log the response for debugging
  
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
      console.warn('-> ProductImageFunctions - getProductImageUrl() - No image path provided');
      return null;
    }
  
    const cleanPath = imagePath.replace(/^\/+/, ''); // Remove leading slashes
    const baseUrl = axiosInstance.defaults.baseURL || ''; // Get the base URL from axios config
    const imageUrl = `${baseUrl}/${cleanPath}`.replace(/([^:]\/)(\/)+/g, "$1"); // Construct the full URL
  
    console.log('Generated Image URL:', imageUrl); // Log the generated URL for debugging
    return imageUrl;
  };
  return {
    handleProductImageUpload,
    getProductImageUrl
  };
};