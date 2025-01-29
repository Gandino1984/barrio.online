import React, { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import { LoginRegisterFunctions } from './hooks/LoginRegisterFunctions.jsx';
import NumericKeyboard from "../numeric_keyboard/NumericKeyboard.jsx";
import ClientManagement from "../../client_management/ClientManagement.jsx";
import styles from '../../../../../public/css/LoginRegisterForm.module.css';
import ShopManagement from "../../shop_management/ShopManagement.jsx";
import { DoorOpen } from 'lucide-react';

const LoginRegisterForm = () => {
  const {
    name_user, currentUser, usernameError,
    isLoggingIn, type_user, 
    showShopManagement, passwordError,
    password, passwordRepeat, showPasswordRepeat,
    keyboardKey, location_user, userlocationError,
    showRepeatPasswordMessage
  } = useContext(AppContext);

  const {
    handlePasswordComplete, handlePasswordChange,
    handleRepeatPasswordChange, isButtonDisabled,
    toggleForm, handleFormSubmit, 
    handleUserTypeChange, handleUsernameChange, 
    handleUserLocationChange,
  } = LoginRegisterFunctions();
  
  if (showShopManagement || currentUser) {
    if (type_user === 'seller') {
      return <ShopManagement/>;
    } else {
      return <ClientManagement/>;
    }
  }

  return (
    <div className={styles.container}>
        <div className={styles.formContainer}>
            <div className={styles.formContentWrapper}>
                {/* Main form content */}
                <form className={styles.formContent} onSubmit={handleFormSubmit}>
                    <div className={styles.inputSection}>
                          <div className={styles.formField}>
                              <input
                                id="name_user"
                                type="text"
                                value={name_user}
                                onChange={handleUsernameChange}
                                className={usernameError ? styles.inputError : styles.nameInput}
                                placeholder={type_user === 'seller' ? 'Nombre de vendedor:' : 'Nombre de cliente:'}
                                required
                              />
                          </div>
                          
                          {!isLoggingIn && (
                              <div className={styles.formField}>
                                  <div className={styles.radioOptions}>
                                      <select 
                                        value={type_user} 
                                        onChange={handleUserTypeChange}
                                        required
                                      >
                                        <option value="" disabled>Tipo de usuario</option>
                                        <option value="user">Cliente</option>
                                        <option value="seller">Vendedor</option>
                                        <option value="provider" disabled>Productor</option>
                                      </select>
                                  </div>
                                
                                  <input
                                    id="location_user"
                                    type="text"
                                    value={location_user}
                                    onChange={handleUserLocationChange}
                                    className={userlocationError ? styles.inputError : ''}
                                    placeholder={type_user === 'seller' ? 'Dirección de vendedor:' : 'Dirección de cliente:'}
                                    required 
                                  />
                              </div>
                            )}
                    </div>

                    <div className={styles.keyboardSection}>
                        {!isLoggingIn && showRepeatPasswordMessage && (
                            <div className={styles.repeatPasswordMessage}>
                              Repite la contraseña
                            </div>
                        )}

                        <div className={styles.numericKeyboardWrapper}>
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
                    </div>
                </form>
            </div>

            {/* Action buttons at the bottom */}
            <div className={styles.formActions}>
              <button
                onClick={handleFormSubmit}
                type="button"
                className={`${styles.submitButton} ${isButtonDisabled() ? styles.inactive : styles.active}`}
                disabled={isButtonDisabled()}
              >
                <DoorOpen size={16} />
                {isLoggingIn ? 'Entrar' : 'Crear cuenta'}
              </button>
              <button 
                type="button" 
                className={styles.toggleButton} 
                onClick={toggleForm}
              >
                {isLoggingIn ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              </button>
            </div>
        </div>
    </div>
  );
};

export default LoginRegisterForm;