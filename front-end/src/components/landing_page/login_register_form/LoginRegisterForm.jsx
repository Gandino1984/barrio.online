import React, { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import { useLoginRegister } from './hooks/useLoginRegister.jsx';
import NumericKeyboard from "../numeric_keyboard/NumericKeyboard.jsx";
import BusinessTypeSelector from "../../business_type_selector/BusinessTypeSelector.jsx";
import styles from './LoginRegisterForm.module.css';
import { X } from 'lucide-react';

const LoginRegisterForm = () => {
  const {
    username,
    isLoggingIn,
    userType,
    showBusinessSelector,
    setShowBusinessSelector,
    password,
    passwordRepeat,
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
    handleUserTypeChange,
    handleUsernameChange,
    usernameError,
    ipError
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
    <div className={styles.container}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>
            {isLoggingIn ? 'INICIA SESIÓN' : 'CREA TU USUARIO'}
          </h2>
          {/* Display IP error if present */}
          {ipError && (
            <div className={styles.errorMessage}>
              {ipError}
            </div>
          )}
          {/* Display username error if present */}
          {usernameError && (
            <div className={styles.errorMessage}>
              {usernameError}
            </div>
          )}
          <form onSubmit={handleFormSubmit} className={styles.formContent}>
            <div className={styles.formField}>
              <label htmlFor="username">1. Escribe tu nombre de usuario</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className={usernameError ? styles.inputError : ''}
                required
              />
            </div>

            {!isLoggingIn && (
              <div className={`${styles.formField} ${styles.radioGroup}`}>
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
    </div>
  );
};

export default LoginRegisterForm;