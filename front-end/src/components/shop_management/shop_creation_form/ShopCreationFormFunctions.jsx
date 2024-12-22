import { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import axiosInstance from '../../../../utils/axiosConfig.js';

export const ShopCreationFormFunctions = () => {
    const { 
        currentUser, 
        setShowShopCreationForm, 
        setshowShopManagement,
        setIsLoggingIn, 
        newShop, 
        setNewShop,
        setShops,
        setError,
        setShopTypes,  // Add this from context
        setIsAddingShop // Add this from context
    } = useContext(AppContext);

    const handleBack = () => {
        setShowShopCreationForm(false);
        setshowShopManagement(true);
    };

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
  
            const createdShop = response.data.data;

            // Update shops list with the newly created shop
            setShops(prevShops => [...prevShops, createdShop]);

            // Ensure the shop type is in shopTypes list
            setShopTypes(prevTypes => {
                if (!prevTypes.includes(createdShop.type_shop)) {
                    return [...prevTypes, createdShop.type_shop];
                }
                return prevTypes;
            });

            // Reset form and states
            setNewShop({
                name_shop: '',
                type_shop: '',
                sub_type: '',
                location_shop: '',
                id_user: '',
                calificacion_shop: ''
            });

            setIsAddingShop(false);
            setShowShopCreationForm(false);
            setshowShopManagement(true);

            // Force a refresh of the shops list by making a new request
            try {
                const refreshResponse = await axiosInstance.post('/shop/by-type', {
                    type_shop: createdShop.type_shop
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                });

                if (!refreshResponse.data.error) {
                    setShops(refreshResponse.data.data || []);
                }
            } catch (refreshErr) {
                console.error('Error refreshing shops list:', refreshErr);
                // Don't throw here - we still want to complete the shop creation flow
            }

            return createdShop;
        } catch (err) {
            setError(err.message || 'Error al crear la tienda');
            console.error('-> - handleAddShop() - Error al crear la tienda = ', err);
            return err;
        }
    };

    return {
        handleBack,
        handleAddShop
    }
};