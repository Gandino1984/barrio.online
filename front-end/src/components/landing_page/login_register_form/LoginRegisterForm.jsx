import React from 'react';
import { LoginRegisterProvider } from './context/LoginRegisterProvider';
import { useLoginRegister } from './hooks/useLoginRegister';
import { useLoginRegisterForm } from "./hooks/loginRegisterFormFunctions";
import { getPasswordValidationMessage } from "./hooks/validationFunctions";
import NumericKeyboard from "../numeric_keyboard/NumericKeyboard.jsx";
import BusinessTypeSelector from "../business_type_selector/BusinessTypeSelector.jsx";
import styles from './LoginRegisterForm.module.css';

const LoginRegisterForm = () => {
  const {
    isLoggingIn,
    setIsLoggingIn,
    username,
    setUsername,
    password,
    setPassword,
    passwordRepeat,
    setPasswordRepeat,
    databaseResponse,
    userType,
    setUserType,
    showPasswordRepeat,
    setShowPasswordRepeat,
    keyboardKey,
    setKeyboardKey,
    showPasswordLabel,
    setShowPasswordLabel,
    showBusinessSelector,
    setShowBusinessSelector
  } = useLoginRegister();

  const {
    handlePasswordComplete,
    handleClear,
    handlePasswordChange,
    handleRepeatPasswordChange,
    isButtonDisabled,
    handleSubmit,
    toggleForm,
    handleBusinessSelect,
    handleBackToForm,
    handleFormSubmit
  } = useLoginRegisterForm(
    isLoggingIn,
    setIsLoggingIn,
    setUsername,
    setPassword,
    setPasswordRepeat,
    password,
    passwordRepeat,
    setShowPasswordRepeat,
    setShowPasswordLabel,
    setKeyboardKey,
    setShowBusinessSelector,
    databaseResponse
  );

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  if (showBusinessSelector) {
    return (
      <BusinessTypeSelector
        onSelectBusiness={handleBusinessSelect}
        onBack={handleBackToForm}
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
            onChange={!isLoggingIn && showPasswordRepeat ? handleRepeatPasswordChange : handlePasswordChange}
            showMaskedPassword
            onPasswordComplete={handlePasswordComplete}
            onClear={handleClear}
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

// Para usar el LoginRegisterForm, necesitas envolverlo en su Provider
export default function LoginRegisterFormWithProvider() {
  return (
    <LoginRegisterProvider>
      <LoginRegisterForm />
    </LoginRegisterProvider>
  );
}