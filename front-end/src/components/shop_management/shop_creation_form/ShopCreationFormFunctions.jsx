import { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import axiosInstance from '../../../../utils/axiosConfig.js';

export const ShopCreationFormFunctions = () => {

    const { currentUser, 
        setShowShopCreationForm, 
        setIsLoggingIn, 
    newShop, setNewShop} = useContext(AppContext);


    const checkUserLogged = () => {
        if(currentUser){
            setNewShop({
                ...newShop,
                id_user: currentUser?.id
            })
            return  newShop;
          }else{
            console.error('El usuario no ha iniciado sesión');
            console.log('-> ShopCreationForm - setShowShopCreationForm(false);');
            console.log('-> ShopCreationForm - setIsLoggingIn(true);');
            setShowShopCreationForm(false);
            setIsLoggingIn(true);
            return null;
          }
    }

    const handleAddShop = async (e) => {
        e.preventDefault();

        const shopData = checkUserLogged();
        
        try {
          console.log('-> ShopCreationForm - New shop data = ', shopData);
    
          const response = await axiosInstance.post('/shop/create', shopData);
          
          if (response.data.error) {
            throw new Error(response.data.error);
          }
    
          // Update shops list and notify parent
          setShops(prevShops => [...prevShops, response.data.data]);

          onShopCreated(response.data.data);
          return response.data.data;
        } catch (err) {
          setError(err.message || 'Error adding shop');
          console.error('Shop creation error:', err);
          return err;
        }
      };

    return   {
        handleAddShop
    }
    }

