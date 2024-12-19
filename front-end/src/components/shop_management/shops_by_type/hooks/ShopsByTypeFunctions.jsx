import { useContext } from 'react';
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
    if (shop && typeof shop === 'object') {
      setSelectedShop(shop);
    }
  };

  const handleBack = () => {
    setSelectedShop(null);
    setshowShopManagement(true);
  };
  
  const fetchShopsByType = async () => {
    if (!shopType) {
      setShops([]);
      return;
    }

    console.log('-> ShopsByTypeFunctions.jsx - fetchShopsByType() - Buscando negocios del tipo = ', shopType);
    try {
      setLoading(true);
      setError(null);

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

      // Validate and filter shops data
      const shopsData = response.data.data;
      if (!Array.isArray(shopsData)) {
        throw new Error('Invalid shops data received');
      }

      const validShops = shopsData.filter(shop => 
        shop && 
        typeof shop === 'object' && 
        shop.id_shop && 
        shop.type_shop === shopType
      );

      setShops(validShops);
      setLoading(false);
    } catch (err) {
      console.error('-> ShopsByTypeFunctions.jsx - fetchShopsByType() - Error = ', err);
      setError(typeof err === 'string' ? err : err.message || `Error al cargar ${shopType} shops`);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleShopSelect,
    fetchShopsByType,
    handleBack
  };
};