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
                setError(prevError => ({ ...prevError, databaseError: "Error al crear la tienda" }));
                throw new Error(response.data.error);
            }
    
            // Fetch updated shops list after successful creation
            await fetchUserShops();
    
            // Reset form state
            setNewShop({
                name_shop: '',
                type_shop: '',
                subtype_shop: '',
                location_shop: '',
                id_user: '',
                calificacion_shop: ''
            });
    
            // Update UI state
            setIsAddingShop(false);
            setShowShopCreationForm(false);
            setshowShopManagement(true);
    
        } catch (err) {
            console.error('Error al crear la tienda:', err);
        }
    };

    return {
        handleBack,
        handleAddShop
    }
};