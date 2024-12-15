import React, { useEffect, useContext } from 'react';
import axiosInstance from '../../../../../utils/axiosConfig.js';
import AppContext from '../../../../app_context/AppContext.js';

export const ShopsByTypeFunctions = () => {

  const {
    shopType, 
    setShops,
    setLoading,
    setError,
  } = useContext(AppContext);
  
  const fetchShopsByType = async () => {
    console.log('!!! Fetching shops by business type:', shopType);
    try {
      setLoading(true);
      const response = await axiosInstance.post('/shop/type', {
        type_shop: shopType
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      setShops(response.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('FULL ERROR:', err);
      setError(err.message || `Error al cargar ${shopType} shops`);
    }finally {
      setLoading(false);
    }
  };

  return {
    fetchShopsByType
  };
};