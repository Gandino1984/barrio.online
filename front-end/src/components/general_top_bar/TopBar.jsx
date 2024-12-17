import React, { useContext } from 'react';
import styles from './TopBar.module.css';
import { TopBarFunctions } from './TopBarFunctions.jsx';
import { ArrowLeft } from 'lucide-react';
import { LogOut } from 'lucide-react';
import AppContext from '../../../src/app_context/AppContext.js';
import { useNavigate } from 'react-router-dom';

function TopBar() {
    const {
      showShopCreationForm,
      selectedShop
    } = useContext(AppContext);
    
    const {
      handleBack,
      clearUserSession
    } = TopBarFunctions();

  

    return (
      <div className={styles.container}>
          <button 
            className={styles.backButton}
            onClick={handleBack}
          > 
              <ArrowLeft size={20} />
          </button>

          <button 
            type="button" 
            className={styles.logoutButton} 
            onClick={clearUserSession}
          >
              <LogOut size={20}/>
              Cerrar Sesión
          </button>
      </div>
    )
}

export default TopBar;