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
        setNewShop,
        setError, error,
        setIsAddingShop 
    } = useContext(AppContext);

    const { fetchUserShops } = ShopManagementFunctions();

    const handleBack = () => {
        setShowShopCreationForm(false);
        setshowShopManagement(true);
    };

    const handleAddShop = async (e) => {
        e.preventDefault();
    
        if (!currentUser) {
            console.error('El usuario no ha iniciado sesión');
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
                setError(prevError => ({ ...prevError, databaseError: "Error al crear el comercio" }));
                throw new Error(response.data.error);
            }
    
            // Reset form state first
            setNewShop({
                name_shop: '',
                type_shop: '',
                subtype_shop: '',
                location_shop: '',
                id_user: '',
                calificaction_shop: 0,
                image_shop: ''
            });
            
            // Update UI state in this specific order
            setIsAddingShop(false);
            setShowShopCreationForm(false);
            
            // Fetch updated shops list after state reset
            await fetchUserShops();
            
            // Finally show management view
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