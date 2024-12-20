import React, { useContext, useEffect } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import { LoginRegisterFunctions } from './hooks/LoginRegisterFunctions.jsx';
import NumericKeyboard from "../numeric_keyboard/NumericKeyboard.jsx";
import UserManagement from "../../user_management/UserManagement.jsx";
import styles from './LoginRegisterForm.module.css';
import ShopManagement from "../../shop_management/ShopManagement.jsx";


const LoginRegisterForm = () => {
  const {
    username, currentUser, usernameError,
    isLoggingIn, userType, 
    showShopManagement, ipError,passwordError,
    password, passwordRepeat, showPasswordRepeat,
    keyboardKey, userlocation, userlocationError, 
  } = useContext(AppContext);

  const {
    handlePasswordComplete, handlePasswordChange,
    handleRepeatPasswordChange, isButtonDisabled,
    toggleForm, handleFormSubmit, 
    handleUserTypeChange, handleUsernameChange, handleUserLocationChange
  } = LoginRegisterFunctions();

  
  console.log('-> LoginRegisterForm.jsx - isLoggingIn state = ', isLoggingIn);
  console.log('-> LoginRegisterForm.jsx - showShopManagement state = ', showShopManagement); 
  


  if (showShopManagement || currentUser) {
    console.log('-> LoginRegisterForm.jsx - userType = ', userType);

    if (userType === 'seller') {
        return (
          <>
            <ShopManagement/>
          </>
        );
    } else {
        return (
          <>
            <UserManagement/>
        </>
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
                      <input
                          id="username"
                          type="text"
                          value={username}
                          onChange={handleUsernameChange}
                          className={usernameError ? styles.inputError : ''}
                          placeholder={userType === 'seller' ? 'Nombre de vendedor:' : 'Nombre de cliente:'}
                          required
                      />
                    {/* {usernameError && <div className={styles.errorText}>{usernameError}</div>}
                    {ipError && <div className={styles.errorText}>{ipError}</div>}
                    {passwordError && <div className={styles.errorText}>{passwordError}</div>} */}
                  </div>
                    {!isLoggingIn && (
                      // Render the user type radio buttons for registration
                      <div className={styles.formField }>
                          <div className={styles.radioOptions}>
                              <select value={userType} 
                              onChange={handleUserTypeChange}
                              required
                              >
                                  <option  value="" disabled>Tipo de usuario</option>
                                  <option value="user">Cliente</option>
                                  <option value="seller">Vendedor</option>
                                  <option value="provider" disabled>Productor</option>
                              </select>
                          </div>
                          
                          <input
                            id="userlocation"
                            type="text"
                            value={userlocation}
                            onChange={handleUserLocationChange}
                            className={userlocationError ? styles.inputError : ''}
                            placeholder={userType === 'seller' ? 'Dirección de tienda. Ej: Matiko, 7, 7a izq' : 'Dirección de cliente. Ej: Matiko, 7, 7a izq'}
                            required />
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
                        error={!!usernameError || !!passwordError}
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