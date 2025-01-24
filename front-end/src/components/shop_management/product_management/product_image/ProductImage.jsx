import React, { useContext } from 'react';
import { Camera } from 'lucide-react';
import AppContext from '../../../../app_context/AppContext';
import styles from '../../../../../../public/css/ProductImage.module.css';
import axiosInstance from '../../../../../utils/axiosConfig.js';
import { validateImageFile } from '../../../../../utils/imageValidation.js';

const ProductImage = ({ product_id }) => {
  const { 
    uploading, 
    setError,
    products,
    setUploading,
    setProducts,
    selectedShop
  } = useContext(AppContext);

  // Get the current product
  const product = products.find(p => p.product_id === product_id);

  if (!product) return null;

  const handleImageUpload = async (event) => {
    if (!event.target.files || !event.target.files[0]) {
        return;
    }

    const file = event.target.files[0];
    
    if (!product_id || !selectedShop?.shop_name) {
        console.error('No product ID or shop name provided');
        setError(prevError => ({ ...prevError, imageError: "Error: No product ID or shop name" }));
        return;
    }

    try {
        // Validate the image file
        await validateImageFile(file);

        // Create FormData and append the file and product information
        const formData = new FormData();
        formData.append('productImage', file);
        formData.append('product_id', product_id);
        formData.append('shop_name', selectedShop.shop_name);

        // Log the FormData payload for debugging
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        setUploading(true);

        // Make the POST request to upload the image
        const response = await axiosInstance.post('/product/upload-product-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Ensure the correct content type
            },
        });

        if (response.data.data?.image_product) {
            // Update the products list with the new image
            setProducts(prevProducts => 
                prevProducts.map(prod =>
                    prod.product_id === product_id 
                        ? { ...prod, image_product: response.data.data.image_product }
                        : prod
                )
            );
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        setError(prevError => ({ 
            ...prevError, 
            imageError: error.message || "Error uploading image" 
        }));
    } finally {
        setUploading(false);
    }
};

  return (
    <div className={styles.productImageContainer}>
      {product.image_product ? (
        <img
          src={`${axiosInstance.defaults.baseURL}/${product.image_product}`}
          alt={`Image of ${product.name_product}`}
          className={styles.productImage}
        />
      ) : (
        <div className={styles.noImage}>No image</div>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        id={`product-image-input-${product_id}`}
        disabled={uploading}
      />
      <label
        htmlFor={`product-image-input-${product_id}`}
        className={styles.uploadButton}
        style={{ cursor: uploading ? 'wait' : 'pointer' }}
      >
        <Camera size={16} />
      </label>
    </div>
  );
};

export default ProductImage;