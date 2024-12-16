import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../app_context/AppContext.js';
import ShopsListByUser from './shops_list_byUser/ShopsListByUser.jsx';
import ShopCreationForm from './shop_creation_form/ShopCreationForm.jsx';
import { ShopManagementFunctions } from './ShopManagementFunctions.jsx';
import styles from './ShopManagement.module.css';
import TopBar from '../general_top_bar/TopBar.jsx';

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
    handleCancel
  } = ShopManagementFunctions();


  useEffect(() => {
    fetchUserShops();
  }, [currentUser]);


  if (loading) return <div>Cargando...</div>;

  if (shops.length === 0) {

    return (
      /* I need to show current user info above the 
      shop creation component */
      <>
          <TopBar />
          <ShopCreationForm />
      </>
    );
  } else {
      if (showShopCreationForm) {
        return (
          <>
              <TopBar />
              <ShopCreationForm />
          </>
        );
      } else {
        return (
          <>
              <TopBar />
              <ShopsListByUser
                onAddShop={() => setIsAddingShop(true)}
                onSelectShop={handleSelectShop}
              />
          </>
        );
      }
  }
};

export default ShopManagement;