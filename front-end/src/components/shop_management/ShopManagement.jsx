import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../app_context/AppContext.js';
import ShopsListBySeller from './shops_list_by_seller/ShopsListBySeller.jsx';
import ShopCreationForm from './shop_creation_form/ShopCreationForm.jsx';
import { ShopManagementFunctions } from './ShopManagementFunctions.jsx';
import  ProductManagement  from '../product_management/ProductManagement.jsx';
import styles from './ShopManagement.module.css';

const ShopManagement = () => {
  const { 
    currentUser, 
    showShopCreationForm
  } = useContext(AppContext);

  const {
    fetchUserShops,
  } = ShopManagementFunctions();

  useEffect(() => {
    fetchUserShops();
  }, [currentUser]);


  return (
    <>
      {showShopCreationForm ? (
        <ShopCreationForm />
      ) : (
        <ShopsListBySeller />
      )}
    </>
  );
};

export default ShopManagement;