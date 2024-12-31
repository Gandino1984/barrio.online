import React, { useContext, useEffect } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import ProductManagementFunctions from './ProductManagementFunctions.jsx';
import ProductCreationForm from './product_creation_form/ProductCreationForm.jsx';
import ShopProductList from './shop_products_list/ShopProductsList.jsx';
import styles from './ProductManagement.module.css';

function ProductManagement() {
  const { 
    selectedShop, 
    showProductManagement
  } = useContext(AppContext);
  
  const { fetchProductsByShop } = ProductManagementFunctions();

  useEffect(() => {
    if (selectedShop) {
      fetchProductsByShop();
    }
  }, [selectedShop]);

  return (
    <div className={styles.productManagementContainer}>
      {showProductManagement ? (
        <ProductCreationForm />
      ) : (
        <ShopProductList />
      )}
    </div>
  );
}

export default ProductManagement;