import { useContext } from 'react';
import axiosInstance from '../../../../utils/axiosConfig.js';
import AppContext from '../../../app_context/AppContext.js';

export const ShopsListBySellerFunctions = () => {
  const {
    setSelectedShop,
    setShops,
    setError,
    setShowShopCreationForm
  } = useContext(AppContext);

  const handleSelectShop = (shop) => {
    setSelectedShop(shop);
  };

  const handleDeleteShop = async (shopId) => {
    console.log("handleDeleteShop - shopId:", shopId);
    try {
      const response = await axiosInstance.post('/shop/removeById', { id_shop: shopId });
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
  
      setShops(prevShops => prevShops.filter(shop => shop.id_shop !== shopId));
    } catch (err) {
      setError(err.message || 'Error eliminando tienda');
      console.error('Shop deletion error:', err);
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




