import { useContext } from 'react';
import AppContext from '../../app_context/AppContext.js';
import axiosInstance from '../../../utils/axiosConfig.js';

export const ShopManagementFunctions = () => {
  const {
    currentUser,
    setShops,
    setError,
    setSelectedShop,
    setshowShopManagement
  } = useContext(AppContext);

  const fetchUserShops = async () => {
    if (!currentUser?.id) {
      console.log('No current user ID available');
      setShops([]);
      return;
    }

    try {
      const response = await axiosInstance.post('/shop/by-user-id', {
        id_user: currentUser.id
      });

      if (response.data.error) {
        setError(prevError => ({ ...prevError, shopError: "Error al obtener las tiendas del usuario" }));
        throw new Error(response.data.error);
      }

      const userShops = response.data.data || [];
      
      setShops(userShops);
    } catch (err) {
      console.error('Error fetching shops:', err);
      setError(prevError => ({ ...prevError, shopError: "Error al obtener las tiendas del usuario" }));
    } 
  };

  const handleBack = () => {
    setshowShopManagement(false);
  };

  const handleSelectShop = (shop) => {
    setSelectedShop(shop);
  };

  return {
    fetchUserShops,
    handleSelectShop,
    handleBack
  };
};