import React, { useEffect, useContext } from 'react';
import axiosInstance from '../../../../../utils/axiosConfig.js';
import AppContext from '../../../../app_context/AppContext.js';

export const ShopsByTypeFunctions = () => {

  const {
    businessType, 
    shops, setShops,
    loading, setLoading,
    error, setError,
    selectedShop, setSelectedShop,
  } = useContext(AppContext);
  
  const fetchShopsByType = async () => {
    console.log('!!! Fetching shops by business type:', businessType);
    try {
      setLoading(true);
      const response = await axiosInstance.post('/shop/type', {
        type_shop: businessType
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
      setError(err.message || `Error al cargar ${businessType} shops`);
    }finally {
      setLoading(false);
    }
  };

  return {
    fetchShopsByType
  };
};