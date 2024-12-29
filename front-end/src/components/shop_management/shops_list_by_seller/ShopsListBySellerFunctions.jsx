import { useContext } from 'react';
import axiosInstance from '../../../../utils/axiosConfig.js';
import AppContext from '../../../app_context/AppContext.js';

export const ShopsListBySellerFunctions = () => {
  const {
    setSelectedShop,
    setShops,
    setShowShopCreationForm,
    setShowProductManagement,
    showProductManagement
  } = useContext(AppContext);


  const handleSelectShop = (shop) => {
    setSelectedShop(shop);
    // show product management, hide shop list, and hide shop creation form    
  };

  const handleAddShop = () => {
    setShowShopCreationForm(true);
  };

  const handleDeleteShop = async (id_shop) => {
    console.log("-> ShopsListBySellerFunctions.jsx - handleDeleteShop() - shopId = ", id_shop);

    try {
      const response = await axiosInstance.delete(`/shop/remove-by-id/${id_shop}`); 
      
      if (response.data.error) {
        setError(prevError => ({ ...prevError, shopError: "Error al borrar la tienda" }));
        throw new Error(response.data.error);
      }
  
      // remove shop fom the UI array
      setShops(existingShops => existingShops.filter(shop => shop.id_shop !== id_shop));
    } catch (err) {
      console.error('-> ShopsListBySellerFunctions.jsx - handleDeleteShop() - Error = ', err);
    }
  };

  return {
    handleSelectShop,
    handleDeleteShop,
    handleAddShop
  };
};




