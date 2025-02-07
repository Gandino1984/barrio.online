import React, { useContext } from 'react';
import styles from '../../../../public/css/TopBar.module.css';
import { TopBarFunctions } from './TopBarFunctions.jsx';
import { ArrowLeft } from 'lucide-react';
import { LogOut, DoorClosed } from 'lucide-react';
import AppContext from '../../app_context/AppContext.js';
import ErrorCard from './error_card/ErrorCard.jsx';
import UserInfoCard from './user_info_card/UserInfoCard.jsx';

// TopBar.jsx
function TopBar() {
  const {
    error,
    showShopCreationForm,
    selectedShop,
  } = useContext(AppContext);
  
  const {
    handleBack,
    clearUserSession
  } = TopBarFunctions();

  return (
    <div className={styles.container}>
        <div className={styles.errorWrapper}>
          {error && <ErrorCard />}
        </div>
        
        <div className={styles.contentWrapper}>
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
    </div>
  )
}

export default TopBar;