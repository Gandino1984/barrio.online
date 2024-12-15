import { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import axiosInstance from '../../../../utils/axiosConfig.js';

export const ShopCreationFormFunctions = () => {
    const { 
        currentUser, 
        setShowShopCreationForm, 
        setIsLoggingIn, 
        newShop, 
        setNewShop,
        setShops, 
        setError
    } = useContext(AppContext);

    const handleAddShop = async (e) => {
        e.preventDefault();

        // Check if user is logged in
        if (!currentUser) {
            console.error('El usuario no ha iniciado sesión');
            setShowShopCreationForm(false);
            setIsLoggingIn(true);
            return;
        }

        // Ensure id_user is set before creating shop
        const shopDataToCreate = {
            ...newShop,
            id_user: currentUser.id
        };

        try {
            console.log('-> Shop creation data:', shopDataToCreate);
  
            const response = await axiosInstance.post('/shop/create', shopDataToCreate);
        
            if (response.data.error) {
                console.error('Shop creation error:', response.data.error);
                throw new Error(response.data.error);
            }
  
            // Update shops list 
            setShops(prevShops => [...prevShops, response.data.data]);

            // Optional: Reset newShop state or handle post-creation logic
            setNewShop({
                name_shop: '',
                type_shop: '',
                sub_type: '',
                location_shop: '',
                id_user: '',
                calificacion_shop: ''
            });

            return response.data.data;
        } catch (err) {
            setError(err.message || 'Error adding shop');
            console.error('Shop creation error:', err);
            return err;
        }
    };

    return {
        handleAddShop
    }
}