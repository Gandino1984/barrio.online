import { useContext } from 'react';
import AppContext from '../../app_context/AppContext.js';
import axiosInstance from '../../../utils/axiosConfig.js';

export const ShopManagementFunctions = () => {
 
    const {
        currentUser,
        setShops,
        setLoading,
        setError,
        setIsAddingShop,
        setSelectedShop,
        setshowShopManagement
      } = useContext(AppContext);

    const fetchUserShops = async () => {
        if (!currentUser) return;
        try {
          setLoading(true);
          const response = await axiosInstance.post('/shop/by-user-id', {
            id_user: currentUser.id
          });
          const userShops = response.data.data?.filter(shop => 
            shop.id_user === currentUser.id
          ) || [];
  
          setShops(userShops);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.error || 'Error fetching shops');
          setLoading(false);
        }
      };
    const handleCancel = () => {
    setshowShopManagement(false);
    };

    const handleSelectShop = (shop) => {
        setSelectedShop(shop);
    };

    const handleShopCreated = (newShop) => {
    setIsAddingShop(false);
    };
    
    return {
        fetchUserShops,
        handleShopCreated,
        handleSelectShop,
        handleCancel
      };
}
