import React, { useContext } from 'react';
import { Camera, Loader } from 'lucide-react';
import AppContext from '../../../../app_context/AppContext';
import styles from '../../../../../../public/css/ProductImage.module.css';
import { ProductImageFunctions } from './ProductImageFunctions.jsx';

const ProductImage = () => {
  const { 
    uploading, 
    setError,
    products,
    selectedProductForImageUpload,
    selectedProducts
  } = useContext(AppContext);

  const {
    handleProductImageUpload,
    getProductImageUrl
  } = ProductImageFunctions();

  // Find the product based on selectedProductForImageUpload
  const product = products.find(p => p.id_product === selectedProductForImageUpload);

  const handleImageUpload = async (event) => {
    if (!event.target.files || !event.target.files[0]) {
      setError(prevError => ({ ...prevError, imageError: "No se ha seleccionado un archivo de imagen" }));
      return;
    }

    try {
      await handleProductImageUpload(event);
      setError(prevError => ({ ...prevError, imageError: '' }));
    } catch (err) {
      setError(prevError => ({ ...prevError, imageError: err.message || "Error al subir la imagen" }));
    }
  };

  // Check if the current product is selected
  const isProductSelected = selectedProducts.has(selectedProductForImageUpload);

  return (
    <div className={styles.productImageContainer}>
      <img
        src={getProductImageUrl(product?.image_product)} 
        alt={`Product image`}
        className={styles.productImage}
      />
      
      {/* Conditional rendering of the file input and label */}
      {isProductSelected && selectedProductForImageUpload && (
        <>
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id={`product-image-input-${selectedProductForImageUpload}`}
            disabled={uploading}
          />
          <label
            htmlFor={`product-image-input-${selectedProductForImageUpload}`}
            className={styles.uploadButton}
            style={{ cursor: uploading ? 'wait' : 'pointer' }}
          >
            <Camera size={16} />
          </label>
        </>
      )}
      
      {uploading && <Loader size={16} />}
    </div>
  );
};

export default ProductImage;