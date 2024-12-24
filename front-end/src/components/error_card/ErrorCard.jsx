import React, { useContext, useEffect } from 'react';
import AppContext from '../../app_context/AppContext.js';
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
        <ul className={styles.errorList}>
          {Object.keys(error).map((errorKey) => (
            <li key={errorKey}>
              {error[errorKey]}
            </li>
          ))}
        </ul>
      </div>
    )
  );
};

export default ErrorCard;