import { useContext } from 'react';
import axiosInstance from '../../../../utils/axiosConfig.js';
import AppContext from '../../../app_context/AppContext.js';

export const ShopCreationFormFunctions = () => {
  const {
    currentUser,
    setShops,
    setError,
    setShowShopCreationForm,
    setSelectedShop,
    setShowErrorCard,
    selectedShop
  } = useContext(AppContext);

  const handleCreateShop = async (formData) => {
    try {
      const response = await axiosInstance.post('/shop/create', {
        ...formData,
        id_user: currentUser.id
      });

      if (response.data.error) {
        setError(prevError => ({ ...prevError, shopError: response.data.error }));
        setShowErrorCard(true);
        throw new Error(response.data.error);
      }

      setShops(prevShops => [...prevShops, response.data.data]);
      setShowShopCreationForm(false);
    } catch (err) {
      console.error('Error creating shop:', err);
      setError(prevError => ({ 
        ...prevError, 
        shopError: 'Error al crear el comercio. Por favor, inténtalo de nuevo.' 
      }));
      setShowErrorCard(true);
    }
  };

  const handleUpdateShop = async (id_shop, formData) => {
    try {
      // Check if shop name has changed
      const isNameChanged = selectedShop && selectedShop.name_shop !== formData.name_shop;

      // Ensure we're sending the correct data structure
      const updateData = {
        id_shop,
        name_shop: formData.name_shop,
        type_shop: formData.type_shop,
        subtype_shop: formData.subtype_shop,
        location_shop: formData.location_shop,
        id_user: currentUser.id,
        calification_shop: formData.calification_shop || 0,
        image_shop: formData.image_shop || ''
      };

      // Add old_name_shop if name is being changed
      if (isNameChanged) {
        updateData.old_name_shop = selectedShop.name_shop;
      }

      console.log('Sending update request with data:', updateData);

      // Use appropriate endpoint based on whether name is changing
      const endpoint = isNameChanged ? '/shop/update-with-folder' : '/shop/update';
      const response = await axiosInstance.patch(endpoint, updateData);

      if (response.data.error) {
        setError(prevError => ({ ...prevError, shopError: response.data.error }));
        setShowErrorCard(true);
        throw new Error(response.data.error);
      }

      setShops(prevShops => 
        prevShops.map(shop => 
          shop.id_shop === id_shop ? { ...shop, ...updateData } : shop
        )
      );
      setShowShopCreationForm(false);
      setSelectedShop(null);
    } catch (err) {
      console.error('Error updating shop:', err);
      setError(prevError => ({ 
        ...prevError, 
        shopError: 'Error al actualizar el comercio. Por favor, inténtalo de nuevo.' 
      }));
      setShowErrorCard(true);
    }
  };

  return {
    handleCreateShop,
    handleUpdateShop
  };
};