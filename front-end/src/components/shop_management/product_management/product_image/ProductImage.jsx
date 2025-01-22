import React, { useContext } from 'react';
import { Camera } from 'lucide-react';
import AppContext from '../../../../app_context/AppContext';
import { ProductImageFunctions } from './ProductImageFunctions';
import styles from '../../../../../../public/css/ProductImage.module.css';

const ProductImage = ({ productId }) => {
  const { 
    uploading, 
    setError,
    products,
    setUploading,
    setProducts
  } = useContext(AppContext);

  const { handleProductImageUpload, getProductImageUrl } = ProductImageFunctions();

  // Get the current product
  const product = products.find(p => p.id_product === productId);

  if (!product) return null;

  const handleImageUpload = async (event) => {
    if (!event.target.files || !event.target.files[0]) {
      return;
    }

    const file = event.target.files[0];
    
    if (!productId) {
      console.error('No product ID provided');
      setError(prevError => ({ ...prevError, imageError: "Error: No product ID" }));
      return;
    }

    try {
      const imageUrl = await handleProductImageUpload(
        file,
        productId,
        setError,
        setUploading
      );

      if (imageUrl) {
        // Update the products list with the new image
        setProducts(prevProducts => 
          prevProducts.map(prod =>
            prod.id_product === productId 
              ? { ...prod, image_product: imageUrl }
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
    }
  };

  return (
    <div className={styles.productImageContainer}>
      {product.image_product ? (
        <img
          src={getProductImageUrl(product.image_product)}
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
        id={`product-image-input-${productId}`}
        disabled={uploading}
      />
      <label
        htmlFor={`product-image-input-${productId}`}
        className={styles.uploadButton}
        style={{ cursor: uploading ? 'wait' : 'pointer' }}
      >
        <Camera size={16} />
      </label>
    </div>
  );
};

export default ProductImage;