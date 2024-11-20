import React, { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import { getPasswordValidationMessage } from "./hooks/validationFunctions.jsx";
import { useLoginRegister } from './hooks/useLoginRegister.jsx';
import NumericKeyboard from "../numeric_keyboard/NumericKeyboard.jsx";
import BusinessTypeSelector from "../business_type_selector/BusinessTypeSelector.jsx";
import styles from './LoginRegisterForm.module.css';

const LoginRegisterForm = () => {
  const {
    username,
    setUsername,
    password,
    passwordRepeat,  
    isLoggingIn,
    userType,
    setUserType,  
    showBusinessSelector,
    setShowBusinessSelector,
    showPasswordLabel,
    showPasswordRepeat,
    keyboardKey,
  } = useContext(AppContext);

  const {
    handlePasswordComplete,
    handleClear,
    handlePasswordChange,
    handleRepeatPasswordChange,
    isButtonDisabled,
    toggleForm,
    handleBusinessSelect,
    handleFormSubmit,
    handleUserTypeChange
  } = useLoginRegister();

  if (showBusinessSelector) {
    return (
      <BusinessTypeSelector
        onSelectBusiness={handleBusinessSelect}
        onBack={() => setShowBusinessSelector(false)}
      />
    );
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>
        {isLoggingIn ? 'INICIA SESIÓN' : 'CREA TU USUARIO'}
      </h2>
      <form onSubmit={handleFormSubmit} className={styles.formContent}>
        <div className={styles.formField}>
          <label htmlFor="username">¿Cuál es tu nombre?</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {!isLoggingIn && (
          <div className={`${styles.formField} ${styles.radioGroup}`}>
            <label className={styles.radioGroupLabel}>Tipo de usuario:</label>
            <div className={styles.radioOptions}>
              <div className={styles.radioOption}>
                <input
                  type="radio"
                  id="client"
                  name="userType"
                  value="client"
                  checked={userType === 'client'}
                  onChange={handleUserTypeChange}
                />
                <label htmlFor="client">Cliente</label>
              </div>
              <div className={styles.radioOption}>
                <input
                  type="radio"
                  id="seller"
                  name="userType"
                  value="seller"
                  checked={userType === 'seller'}
                  onChange={handleUserTypeChange}
                />
                <label htmlFor="seller">Vendedor</label>
              </div>
              <div className={styles.radioOption}>
                <input
                  type="radio"
                  id="provider"
                  name="userType"
                  value="provider"
                  checked={userType === 'provider'}
                  onChange={handleUserTypeChange}
                />
                <label htmlFor="provider">Proveedor</label>
              </div>
            </div>
          </div>
        )}

        <div className={styles.formField}>
          <label htmlFor="password" className={styles.passwordLabel}>
            {getPasswordValidationMessage(
              isLoggingIn,
              showPasswordRepeat,
              passwordRepeat,
              password,
              showPasswordLabel
            )}
          </label>
          <NumericKeyboard
            key={keyboardKey}
            value={!isLoggingIn && showPasswordRepeat ? passwordRepeat : password}
            onChange={!isLoggingIn && showPasswordRepeat 
              ? handleRepeatPasswordChange 
              : (newPassword) => handlePasswordChange(isLoggingIn, newPassword)}
            onPasswordComplete={handlePasswordComplete(isLoggingIn)}
            onClear={handleClear(isLoggingIn)}
          />
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={`${styles.submitButton} ${isButtonDisabled() ? styles.inactive : styles.active}`}
            disabled={isButtonDisabled()}
          >
            {isLoggingIn ? 'Entrar' : 'Crear cuenta'}
          </button>
          <button type="button" className={styles.toggleButton} onClick={toggleForm}>
            {isLoggingIn ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginRegisterForm;