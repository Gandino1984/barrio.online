/**
 * LoginRegisterForm component
 * 
 * This component handles the login and registration form for the application.
 * It uses the AppContext to access and update the application state.
 * 
 * @returns {JSX.Element} The JSX element representing the login/registration form.
 */

import React, { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import { LoginRegisterFunctions } from './hooks/LoginRegisterFunctions.jsx';
import NumericKeyboard from "../numeric_keyboard/NumericKeyboard.jsx";
import UserManagement from "../../user_management/UserManagement.jsx";
import styles from './LoginRegisterForm.module.css';
import ShopManagement from "../../shop_management/ShopManagement.jsx";

const LoginRegisterForm = () => {
  const {
    username,setUsername, 
    isLoggingIn, userType,
    showBusinessSelector,setShowBusinessSelector,
    password, passwordRepeat, showPasswordRepeat,
    keyboardKey
  } = useContext(AppContext);

  const {
    handlePasswordComplete,
    handleClear, handlePasswordChange,
    handleRepeatPasswordChange, isButtonDisabled,
    toggleForm, handleBusinessSelect,
    handleFormSubmit, handleUserTypeChange,
    handleUsernameChange, usernameError,
    ipError
  } = LoginRegisterFunctions();

  // If the business selector is shown, render the ShopManagement or UserManagement component
  if (showBusinessSelector) {
    if (userType === 'seller') {
        return (
          <ShopManagement
          onBack={() => setShowBusinessSelector(false)}
          />
        );
    } else {
        return (
          <UserManagement
            onSelectBusiness={handleBusinessSelect}
            onBack={() => setShowBusinessSelector(false)}
          />
        );
    }
}
  // Render the login/registration form
  return (
    <div className={styles.container}>
          <div className={styles.formContainer}>
              <h2 className={styles.formTitle}>
                  {isLoggingIn ? 'INICIA SESIÓN' : 'CREA TU USUARIO'}
              </h2>
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
                      // Render the user type radio buttons for registration
                      <div className={`${styles.formField} ${styles.radioGroup}`}>
                          <div className={styles.radioOptions}>
                              <div className={styles.radioOption}>
                                  <input
                                    type="radio"
                                    id="user"
                                    name="userType"
                                    value="user"
                                    checked={userType === 'user'}
                                    onChange={handleUserTypeChange}
                                  />
                                  <label htmlFor="user">Usuario</label>
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