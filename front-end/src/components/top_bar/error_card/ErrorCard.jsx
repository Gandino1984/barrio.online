import React, { useContext, useEffect } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import styles from './ErrorCard.module.css';
import { CircleX } from 'lucide-react';

const ErrorCard = () => {
  const {
    isLoggingIn,
    showShopManagement,
    showErrorCard, setShowErrorCard,
    error, clearError
  } = useContext(AppContext);

  useEffect(() => {
    if (!error) {
      clearError();
    }
  }, [error]);

  useEffect(() => {
    if (!Object.values(error).some((error) => error)) {
      setShowErrorCard(false);
    } else {
      setShowErrorCard(true);
      
      const timer = setTimeout(() => {
        setShowErrorCard(false);
      }, 6000);

      return () => clearTimeout(timer); 
    }
  }, [isLoggingIn, showShopManagement, error
  ]);

  return (
    showErrorCard && (
      <div className={styles.container}>
        <CircleX color="red" size={24} />
        <div className={styles.errorList}>
          {Object.keys(error).map((errorKey) => (
            <div className={styles.errorItem} key={errorKey}>
              {error[errorKey]}
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default ErrorCard;