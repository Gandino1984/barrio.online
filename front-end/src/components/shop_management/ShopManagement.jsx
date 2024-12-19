import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../app_context/AppContext.js';
import ShopsListBySeller from './shops_list_by_seller/ShopsListBySeller.jsx';
import ShopCreationForm from './shop_creation_form/ShopCreationForm.jsx';
import { ShopManagementFunctions } from './ShopManagementFunctions.jsx';
import styles from './ShopManagement.module.css';

const ShopManagement = () => {
  const { 
    currentUser, 
    shops, 
    loading,  
    error, setError,
    showShopCreationForm, setShowShopCreationForm,
    setIsAddingShop
  } = useContext(AppContext);

  const {
    fetchUserShops,
    handleSelectShop,
    handleBack
  } = ShopManagementFunctions();


  useEffect(() => {
    fetchUserShops();
  }, [currentUser]);


  if (loading) return <div>Cargando...</div>;

  if (shops.length === 0 || showShopCreationForm) {
    return (
      /* I need to show current user info above the 
      shop creation component */
      <>
          <ShopCreationForm />
      </>
    );
  } else {
      return (
          /* I need to show current user info above the 
         shop creation component */
        <>
            <ShopsListBySeller
              onAddShop={() => setIsAddingShop(true)}
              onSelectShop={handleSelectShop}
            />
        </>
      );
      
  }
};

export default ShopManagement;