import { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import axiosInstance from '../../../../utils/axiosConfig.js';

export const ShopCreationFormFunctions = () => {

    const { currentUser, 
        setShowShopCreationForm, 
        setIsLoggingIn, 
    newShop, setNewShop,
    setShops, setError
  } = useContext(AppContext);

  const checkUserLogged = () => {
      console.log('-> ShopCreationFormFunctions.jsx - checkUserLogged() - currentUser = ', currentUser);
      //if the user is logged
      //associate the shop to the logged user
      if(currentUser){
          setNewShop({
              ...newShop,
              id_user: currentUser?.id
          })
          return  newShop;
        }else{
          console.error('El usuario no ha iniciado sesión');
      
          setShowShopCreationForm(false);
      
          setIsLoggingIn(true);
      
          console.log('-> ShopCreationForm - setShowShopCreationForm(false);');
          console.log('-> ShopCreationForm - setIsLoggingIn(true);');
          return null;
        }
  }

  const handleAddShop = async (e) => {
      e.preventDefault();

      //shop data from the form
      //with the logged id_user added
      const shopData = checkUserLogged();
      
      try {
        console.log('-> ShopCreationFormFunctions.jsx - handleAddShop() - New shop data with owner info(id_user)= ', shopData);
  
        const response = await axiosInstance.post('/shop/create', shopData);
        
        if (response.data.error) {
          console.error('Shop creation error:', response.data.error);
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

