import React, { useContext } from 'react';
import styles from './TopBar.module.css';
import { TopBarFunctions } from './TopBarFunctions.jsx';
import { ArrowLeft } from 'lucide-react';
import { LogOut } from 'lucide-react';
import AppContext from '../../../src/app_context/AppContext.js';
import ErrorCard from '../error_card/ErrorCard.jsx';

function TopBar() {
    const {
      error,
      isLoggingIn,
      showShopManagement,
      showShopCreationForm,
      selectedShop
    } = useContext(AppContext);
    
    const {
      handleBack,
      clearUserSession
    } = TopBarFunctions();

  
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