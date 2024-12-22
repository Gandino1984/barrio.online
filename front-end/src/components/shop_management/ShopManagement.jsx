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
      <>
          <ShopCreationForm />
      </>
    );
  } else {
      return (
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