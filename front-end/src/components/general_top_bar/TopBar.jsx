import React from 'react';
import styles from './TopBar.module.css';
import {TopBarFunctions} from './TopBarFunctions.jsx';
import { useContext } from 'react';
import { ArrowLeft } from 'lucide-react';

function TopBar() {
    const { 
        
      } = useContext(AppContext);
    
      const {
        clearUserSession
    } = TopBarFunctions();

  return (
    <>
    
       <div className={styles.container}>
                <button 
                  className={styles.backButton}
                > 
                  <ArrowLeft size={20} />
                </button>
                <button type="button" className={styles.logoutButton} onClick={clearUserSession}>
                    Cerrar Sesión
                </button>
        </div>
    </>
  )
}

export default TopBar
