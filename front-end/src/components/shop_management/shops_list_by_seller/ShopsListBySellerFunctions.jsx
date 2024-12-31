import { useContext } from 'react';
import axiosInstance from '../../../../utils/axiosConfig.js';
import AppContext from '../../../app_context/AppContext.js';

export const ShopsListBySellerFunctions = () => {
  const {
    setSelectedShop,
    setShops,
    setShowShopCreationForm,
    setShowProductManagement,
    setError
  } = useContext(AppContext);

  const handleSelectShop = (shop) => {
    setSelectedShop(shop);
    setShowProductManagement(true);
    setShowShopCreationForm(false);
  };

  const handleAddShop = () => {
    setShowShopCreationForm(true);
    setShowProductManagement(false);
  };

  const handleDeleteShop = async (id_shop) => {
    try {
      const response = await axiosInstance.delete(`/shop/remove-by-id/${id_shop}`); 
      
      if (response.data.error) {
        setError(prevError => ({ ...prevError, shopError: "Error al borrar la tienda" }));
        throw new Error(response.data.error);
      }
  
      setShops(existingShops => existingShops.filter(shop => shop.id_shop !== id_shop));
    } catch (err) {
      console.error('Error deleting shop:', err);
    }
  };

  return {
    handleSelectShop,
    handleDeleteShop,
    handleAddShop
  };
};