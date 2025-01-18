import React, { useContext, useEffect } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import styles from '../../../../../public/css/ErrorCard.module.css';
import { CircleX } from 'lucide-react';

const ErrorCard = () => {
  const {
    isLoggingIn,
    showShopManagement,
    showErrorCard, setShowErrorCard,
    error, setError
  } = useContext(AppContext);

  // Remove the initial useEffect that was clearing errors

  useEffect(() => {
    // Only show error card if there are actual errors
    const hasErrors = Object.values(error).some(err => err !== '');
    
    if (!hasErrors) {
      setShowErrorCard(false);
    } else {
      setShowErrorCard(true);
      
      const timer = setTimeout(() => {
        setShowErrorCard(false);
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [error, setShowErrorCard]);

  // Only render errors that actually have a message
  const activeErrors = Object.entries(error).filter(([_, value]) => value !== '');

  return (
    showErrorCard && activeErrors.length > 0 && (
      <div className={styles.container}>
        <CircleX color="red" size={24} />
        <div className={styles.errorList}>
          {activeErrors.map(([key, value]) => (
            <div className={styles.errorItem} key={key}>
              {value}
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default ErrorCard;