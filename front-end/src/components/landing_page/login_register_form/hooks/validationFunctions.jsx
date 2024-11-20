import { Check, X } from 'lucide-react';
import styles from "../LoginRegisterForm.module.css";
import React, { useContext } from 'react';
import AppContext from '../../../../app_context/AppContext.js';

export const getPasswordValidationMessage = () => {
  
  const {
    isLoggingIn,
    password,
    passwordRepeat,
    showPasswordRepeat, 
    showPasswordLabel, 
  } = useContext(AppContext);
  
  if (!isLoggingIn && showPasswordRepeat) {
    if (passwordRepeat.length === 4) {
      if (password === passwordRepeat) {
        return (
          <div className={styles.validationMessage}>
            <span className={styles.validText}>Contraseña válida</span>
            <Check className={styles.validIcon} size={20} />
          </div>
        );
      } else {
        return (
          <div className={styles.validationMessage}>
            <span className={styles.errorText}>Las contraseñas no coinciden</span>
            <X className={styles.errorIcon} size={20} />
          </div>
        );
      }
    }
    return "Repite tu contraseña";
  }
  return showPasswordLabel ? "Teclea tu contraseña" : "";
};
