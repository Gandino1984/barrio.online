import React, { useContext, useEffect } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import ProductManagementFunctions from './ProductManagementFunctions.jsx';
import ProductCreationForm from './product_creation_form/ProductCreationForm.jsx';
import styles from './ProductManagement.module.css';

function ProductManagement() {
  const { selectedShop } = useContext(AppContext);
  const { fetchProductsByShop } = ProductManagementFunctions();

  useEffect(() => {
    if (selectedShop) {
      fetchProductsByShop();
    }
  }, [selectedShop]);

  return (
    <div className={styles.productManagementContainer}>
      <ProductCreationForm />
    </div>
  );
}

export default ProductManagement;