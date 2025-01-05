import React, { useContext } from 'react';
import styles from './TopBar.module.css';
import { TopBarFunctions } from './TopBarFunctions.jsx';
import { ArrowLeft } from 'lucide-react';
import { LogOut, DoorClosed } from 'lucide-react';
import AppContext from '../../app_context/AppContext.js';
import ErrorCard from './error_card/ErrorCard.jsx';
import UserInfoCard from './user_info_card/UserInfoCard.jsx';

function TopBar() {
    const {
      error,
      showShopCreationForm,
      selectedShop,
      showErrorCard,
    } = useContext(AppContext);
    
    const {
      handleBack,
      clearUserSession
    } = TopBarFunctions();

    console.log('-> TopBar.jsx - selectedShop = ', selectedShop);

    return (
      <div className={styles.container}>
          {error && <ErrorCard />}
          
          {(selectedShop || showShopCreationForm) && (
            <button
              className={styles.backButton}
              onClick={handleBack}
            >
              <ArrowLeft size={16} />
            </button>
          )}

          <UserInfoCard />

          <button 
            type="button" 
            className={styles.logoutButton} 
            onClick={clearUserSession}
          >
              Cerrar
              <DoorClosed size={16}/>
              
          </button>
      </div>
    )
}

export default TopBar;