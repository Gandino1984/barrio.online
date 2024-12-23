import { useContext, useEffect } from 'react';
import axiosInstance from '../../../../utils/axiosConfig.js';
import AppContext from '../../../app_context/AppContext.js';
import {ShopManagementFunctions} from '../ShopManagementFunctions.jsx';

export const ShopsListBySellerFunctions = () => {
  const {
    setSelectedShop,
    setShops,
    shops,
    setError,
    setShowShopCreationForm,
    currentUser,
  } = useContext(AppContext);

    const { 
      fetchUserShops
    } = ShopManagementFunctions();

    // useEffect(() => {
    //   fetchUserShops();
    // }, []);

  const handleSelectShop = (shop) => {
    setSelectedShop(shop);
  };

  const handleDeleteShop = async (shopId) => {
    console.log("handleDeleteShop - shopId:", shopId);

    try {
    
      const response = await axiosInstance.post('/shop/remove-by-id', { 
        id_shop: shopId 
      });
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
  
      setShops(prevShops => prevShops.filter(shop => shop.id_shop !== shopId));
    } catch (err) {
      setError(err.message || 'Error eliminando tienda');
      console.error('-> ShopsListBySellerFunctions.jsx - handleDeleteShop() - Error = ', err);
    }
  };

  const handleAddShop = () => {
    setShowShopCreationForm(true);
  };

  return {
    handleSelectShop,
    handleDeleteShop,
    handleAddShop
  };
};




