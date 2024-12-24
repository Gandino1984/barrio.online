import { useContext, useEffect } from 'react';
import axiosInstance from '../../../../utils/axiosConfig.js';
import AppContext from '../../../app_context/AppContext.js';
import {ShopManagementFunctions} from '../ShopManagementFunctions.jsx';

export const ShopsListBySellerFunctions = () => {
  const {
    setSelectedShop,
    setShops,
    setError,
    setShowShopCreationForm,
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

  const handleAddShop = () => {
    setShowShopCreationForm(true);
  };

  const handleDeleteShop = async (id_shop) => {
    console.log("-> ShopsListBySellerFunctions.jsx - handleDeleteShop() - shopId = ", id_shop);

    try {
    
      const response = await axiosInstance.delete(`/shop/remove-by-id/${id_shop}`); 
      
      if (response.data.error) {
        setError(prevError => ({ ...prevError, databaseResponse: response.data.error }));
        throw new Error(response.data.error);
      }
  
      // remove shop fom the UI array
      setShops(existingShops => existingShops.filter(shop => shop.id_shop !== id_shop));

    } catch (err) {
      
      setError(prevError => ({ ...prevError, backendResponse: err.message }));
      
      console.error('-> ShopsListBySellerFunctions.jsx - handleDeleteShop() - Error = ', err);
    }
  };



  return {
    handleSelectShop,
    handleDeleteShop,
    handleAddShop
  };
};




