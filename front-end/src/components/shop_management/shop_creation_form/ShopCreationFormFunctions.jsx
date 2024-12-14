import { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import axiosInstance from '../../../../utils/axiosConfig.js';

export const ShopCreationFormFunctions = () => {

    const { currentUser, 
        setShowShopCreationForm, 
        setIsLoggingIn } = useContext(AppContext);

    const checkUserLogged = () => {
        if(currentUser){
            const [newShop, setNewShop] = useState({
              name_shop: '',
              location_shop: '',
              type_shop: '',
              sub_type: '',
              id_user: currentUser?.id
            });
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

    return{
        checkUserLogged
    }

}

