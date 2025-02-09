import React, { useContext } from 'react';
import AppContext from '../../../../src/app_context/AppContext';
import { LoginRegisterFunctions } from '../login_register_form/hooks/LoginRegisterFunctions.jsx';
import NumericKeyboard from "../../../../src/components/login_register/numeric_keyboard/NumericKeyboard.jsx";
import styles from '../../../../../public/css/LoginRegisterForm.module.css';

export const KeyboardSection = () => {
  const {
    isLoggingIn,
    showRepeatPasswordMessage,
    keyboardKey,
    passwordRepeat,
    password,
    showPasswordRepeat,
    usernameError,
    passwordError,
  } = useContext(AppContext);

  const {
    handlePasswordComplete,
    handleRepeatPasswordChange,
    handlePasswordChange,
  } = LoginRegisterFunctions();

  return (
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
  );
};