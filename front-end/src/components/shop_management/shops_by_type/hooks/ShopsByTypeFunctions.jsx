import React, { useEffect, useContext } from 'react';
import axiosInstance from '../../../../../utils/axiosConfig.js';
import AppContext from '../../../../app_context/AppContext.js';

export const ShopsByTypeFunctions = () => {

  const {
    shopType, 
    setShops,
    setLoading,
    setError,
    setSelectedShop, 
    setshowShopManagement 
  } = useContext(AppContext);

  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
  };

  const handleBack = () => {
    setSelectedShop(null);
    setshowShopManagement(true);
  };
  
  const fetchShopsByType = async () => {
    console.log('-> ShopsByTypeFunctions.jsx - fetchShopsByType() - Buscando negocios del tipo = ', shopType);
    try {
      setLoading(true);

      const response = await axiosInstance.post('/shop/type', {
        type_shop: shopType
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('-> ShopsByTypeFunctions.jsx - fetchShopsByType() - Response = ', response);

      if (response.data.error) {
        console.error('-> ShopsByTypeFunctions.jsx - fetchShopsByType() - Error =', response.data.error);
        throw new Error(response.data.error);
      }

      setShops(response.data.data || []);
      // just added
      // setLoading(false);
    } catch (err) {
      console.error('-> ShopsByTypeFunctions.jsx - fetchShopsByType() - Error = ', err);
      setError(err.message || `Error al cargar ${shopType} shops`);
    }
    finally {
      setLoading(false);
    }
  };

  return {
    handleShopSelect,
    fetchShopsByType,
    handleBack
  };
};