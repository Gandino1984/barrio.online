import { useState, useContext } from 'react';
import AppContext from '../../../../app_context/AppContext';
import axiosInstance from '../../../../../utils/axiosConfig.js';

export const ShopCoverImageFunctions = () => {
  const {
    setError,
    setUploading,
    selectedShop,
    setShops,
    shops,
    uploading
  } = useContext(AppContext);

  const [showUploadButton, setShowUploadButton] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleContainerClick = (id_shop) => {
    if (selectedShop?.id_shop === id_shop) {
      setShowUploadButton(!showUploadButton);
    }
  };

  const handleUploadButtonClick = (e) => {
    e.stopPropagation();
  };

  const handleShopCoverUpload = async (file) => {
    if (!file) {
      throw new Error("No file provided");
    }

    if (!selectedShop?.id_shop) {
      throw new Error("No shop selected");
    }

    try {
      const formData = new FormData();
      formData.append('shopCover', file);

      setUploading(true);
      setUploadProgress(0);

      const response = await axiosInstance.post(
        '/shop/upload-cover-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Shop-ID': selectedShop.id_shop,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          },
        }
      );

      if (!response.data || !response.data.data) {
        throw new Error('Invalid response from server');
      }

      const { image_shop } = response.data.data;
      
      if (!image_shop) {
        throw new Error('No image path received from server');
      }

      // Update the shops list with the new cover image
      const updatedShops = shops.map(shop =>
        shop.id_shop === selectedShop.id_shop
          ? { ...shop, image_shop }
          : shop
      );

      await setShops(updatedShops);
      setShowUploadButton(false);
      
      // Verify the update was successful
      const updatedShop = updatedShops.find(shop => shop.id_shop === selectedShop.id_shop);
      if (!updatedShop || updatedShop.image_shop !== image_shop) {
        throw new Error('Failed to update shop image in state');
      }

      return image_shop;
    } catch (err) {
      console.error('Error uploading shop cover:', err);
      setError(prevError => ({
        ...prevError,
        imageError: err.response?.data?.error || err.message || "Error uploading file",
      }));
      throw err;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleImageUpload = async (event, id_shop) => {
    event.stopPropagation();
    
    const file = event.target.files[0];
    if (!file) {
      setError(prevError => ({ 
        ...prevError, 
        imageError: "No se ha seleccionado un archivo de imagen" 
      }));
      return;
    }

    // Validate file size and type before upload
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError(prevError => ({
        ...prevError,
        imageError: "File size must be less than 5MB"
      }));
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError(prevError => ({
        ...prevError,
        imageError: "Invalid file type. Only JPEG, PNG, JPG, and WEBP are allowed."
      }));
      return;
    }

    try {
      await handleShopCoverUpload(file);
    } catch (error) {
      console.error('Error uploading cover:', error);
    }
  };

  const getShopCoverUrl = (imagePath) => {
    if (!imagePath) {
      console.warn('No image path provided');
      return null;
    }

    try {
      const cleanPath = imagePath.replace(/^\/+/, '');
      const baseUrl = axiosInstance.defaults.baseURL || '';
      const imageUrl = `${baseUrl}/${cleanPath}`.replace(/([^:]\/)(\/)+/g, "$1");

      // Verify the URL is valid
      new URL(imageUrl);
      
      return imageUrl;
    } catch (error) {
      console.error('Error generating shop cover URL:', error);
      return null;
    }
  };

  return {
    handleContainerClick,
    handleUploadButtonClick,
    handleImageUpload,
    getShopCoverUrl,
    showUploadButton,
    uploading,
    uploadProgress
  };
};