import React, { useContext } from 'react';
import { Camera } from 'lucide-react';
import AppContext from '../../../../app_context/AppContext';
import { ProductImageFunctions } from './ProductImageFunctions';
import styles from '../../../../../../public/css/ProductImage.module.css';

const ProductImage = ({ id_product }) => {
  const { 
    uploading, 
    setError,
    products,
    setUploading,
    setProducts
  } = useContext(AppContext);

  const { handleProductImageUpload, getProductImageUrl } = ProductImageFunctions();

  // Get the current product
  const product = products.find(p => p.id_product === id_product);

  if (!product) return null;


  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    console.log('Product ID before upload:', id_product);

    if (!file) {
      console.error('No file selected');
      return;
  }

  // Verify product ID exists before upload
  if (!id_product) {
    setError(prevError => ({ 
        ...prevError, 
        imageError: "Invalid Product ID: Cannot upload image" 
    }));
    return;
  }

    try {
        const imageUrl = await handleProductImageUpload(
            file,
            id_product,
            setError,
            setUploading
        );

        if (imageUrl) {
            setProducts(prevProducts => 
                prevProducts.map(prod =>
                    prod.id_product === id_product 
                        ? { ...prod, image_product: imageUrl }
                        : prod
                )
            );
            
            // Optional: Show success message
            setError(prevError => ({ 
                ...prevError, 
                imageError: "Image uploaded successfully" 
            }));
        }
    } catch (error) {
        console.error('Image upload error:', error);
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
        id={`product-image-input-${id_product}`}
        disabled={uploading}
      />
      <label
        htmlFor={`product-image-input-${id_product}`}
        className={styles.uploadButton}
        style={{ cursor: uploading ? 'wait' : 'pointer' }}
      >
        <Camera size={16} />
      </label>
    </div>
  );
};

export default ProductImage;