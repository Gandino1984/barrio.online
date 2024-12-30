import React, { useContext, useEffect } from 'react';
import AppContext from '../../app_context/AppContext.js';
import ShopsListBySeller from './shops_list_by_seller/ShopsListBySeller.jsx';
import ShopCreationForm from './shop_creation_form/ShopCreationForm.jsx';
import ProductManagement from './product_management/ProductManagement.jsx';
import { ShopManagementFunctions } from './ShopManagementFunctions.jsx';
import styles from './ShopManagement.module.css';

const ShopManagement = () => {
  const { 
    currentUser, 
    showShopCreationForm,
    selectedShop,
    showProductManagement
  } = useContext(AppContext);

  const {
    fetchUserShops,
  } = ShopManagementFunctions();

  useEffect(() => {
    fetchUserShops();
  }, [currentUser]);

  // Determine what to render based on the current state
  const renderComponent = () => {
    if (showProductManagement && selectedShop) {
      return <ProductManagement />;
    }
    if (showShopCreationForm) {
      return <ShopCreationForm />;
    }
    return <ShopsListBySeller />;
  };

  return (
    <div className={styles.shopManagementContainer}>
      {renderComponent()}
    </div>
  );
};

export default ShopManagement;