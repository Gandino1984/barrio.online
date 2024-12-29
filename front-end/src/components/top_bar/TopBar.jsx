import React, { useContext } from 'react';
import styles from './TopBar.module.css';
import { TopBarFunctions } from './TopBarFunctions.jsx';
import { ArrowLeft } from 'lucide-react';
import { LogOut } from 'lucide-react';
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
    console.log('-> TopBar.jsx - showShopCreationForm = ', showShopCreationForm);

    return (
      <div className={styles.container}>
          {error && <ErrorCard />}
          
          {(selectedShop || showShopCreationForm) && (
            <button
              className={styles.backButton}
              onClick={handleBack}
            >
              <ArrowLeft size={24} />
            </button>
          )}

          <UserInfoCard />

          <button 
            type="button" 
            className={styles.logoutButton} 
            onClick={clearUserSession}
          >
              <LogOut size={24}/>
              Cerrar
          </button>
      </div>
    )
}

export default TopBar;