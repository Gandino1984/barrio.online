import { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import axiosInstance from '../../../../utils/axiosConfig.js';
import { ShopManagementFunctions } from '../ShopManagementFunctions.jsx';

export const ShopCreationFormFunctions = () => {
    const { 
        currentUser, 
        setShowShopCreationForm, 
        setshowShopManagement,
        setIsLoggingIn, 
        newShop,
        setShops, 
        setNewShop,
        setError, error,
        setIsAddingShop 
    } = useContext(AppContext);

    // const { fetchUserShops } = ShopManagementFunctions();

    const handleBack = () => {
        setShowShopCreationForm(false);
        setshowShopManagement(true);
    };

    const handleAddShop = async (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            console.error('-> ShopCreationFormFunctions.jsx - handleAddShop() - El usuario no ha iniciado sesión');
            setShowShopCreationForm(false);
            setIsLoggingIn(true);
            return;
        }
    
        const shopDataToCreate = {
            ...newShop,
            id_user: currentUser.id
        };
    
        try {
            const response = await axiosInstance.post('/shop/create', shopDataToCreate);
            
            if (response.data.error) {
                setError(prevError => ({ ...prevError, databaseError: "Error al crear el comercio. Prueba con otro nombre." }));
                throw new Error(response.data.error);
            }
    
            // Directly update shops in context
            const shopsResponse = await axiosInstance.post('/shop/by-user-id', { id_user: currentUser.id });
            
            if (shopsResponse.data.data) {
                setShops(shopsResponse.data.data);
            }
    
            // Reset form state and UI
            setNewShop({
                name_shop: '',
                type_shop: '',
                subtype_shop: '',
                location_shop: '',
                id_user: '',
                calificaction_shop: 0,
                image_shop: ''
            });
            
            setIsAddingShop(false);
            setShowShopCreationForm(false);
            setshowShopManagement(true);
    
        } catch (err) {
            console.error('Error al crear el comercio:', err);
        }
    };

    return {
        handleBack,
        handleAddShop
    }
};