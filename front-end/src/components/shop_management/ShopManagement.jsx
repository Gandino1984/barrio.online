import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../app_context/AppContext.js';
import axiosInstance from '../../../utils/axiosConfig.js';
import ShopsList from './shops_list_byUser/ShopsList.jsx';
import ShopCreationForm from './shop_creation_form/ShopCreationForm.jsx';

const ShopManagement = ({ onBack }) => {
  const { 
    currentUser, 
    shops, setShops, 
    loading, setLoading, 
    error, setError,
    selectedShop, setSelectedShop,
    showShopCreationForm, setShowShopCreationForm,
    ShowBusinessSelector, setShowBusinessSelector,
    isAddingShop, setIsAddingShop
  } = useContext(AppContext);


  const handleCancel = () => {
    setShowBusinessSelector(false);
  };

  useEffect(() => {
    const fetchUserShops = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const response = await axiosInstance.post('/shop/by-user-id', {
          id_user: currentUser.id
        });
        const userShops = response.data.data?.filter(shop => 
          shop.id_user === currentUser.id
        ) || [];

        setShops(userShops);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching shops');
        setLoading(false);
      }
    };
    fetchUserShops();
  }, [currentUser]);

  const handleShopCreated = (newShop) => {
    setIsAddingShop(false);
  };

  const handleSelectShop = (shop) => {
    setSelectedShop(shop);
  };

  if (loading) return <div>Cargando...</div>;

  if (shops.length === 0) {
    // User has no shops, show ShopCreationForm
    return (
      <ShopCreationForm 
        onShopCreated={handleShopCreated}
        onCancel={handleCancel} 
      />
    );
  } else {
    // User has shops, show ShopsList
    return (
      <ShopsList
        onBack={onBack}   
        onAddShop={() => setIsAddingShop(true)}
        onSelectShop={handleSelectShop}
      />
    );
  }

};

export default ShopManagement;