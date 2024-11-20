import React, { useEffect } from 'react';
import { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import { useNumericKeyboardFunctions } from './hooks/useNumericKeyboardFunctions.jsx';
import { Delete, Trash2, RotateCcw } from 'lucide-react';
import styles from './NumericKeyboard.module.css';

const NumericKeyboard = ({ 
  value, 
  onChange, 
  showMaskedPassword = true, 
  onPasswordComplete, 
  onClear 
}) => {
  const {
    MAX_PASSWORD_LENGTH,
    displayedPassword,
    setDisplayedPassword,
    isLoggingIn,
    password,
    passwordRepeat,
    showPasswordRepeat
  } = useContext(AppContext);

  const showRetryIcon = !isLoggingIn && 
    showPasswordRepeat && 
    passwordRepeat.length === MAX_PASSWORD_LENGTH && 
    password !== passwordRepeat;

  const {
    handleKeyClick,
    handleBackspace,
    handleClearPassword
  } = useNumericKeyboardFunctions(value, onChange, onPasswordComplete, onClear);

  useEffect(() => {
    const maskedPassword = showMaskedPassword 
      ? '*'.repeat(displayedPassword.length) 
      : displayedPassword;
    setDisplayedPassword(maskedPassword);
  }, [displayedPassword, showMaskedPassword]);

  return (
    <div className={styles.container}>
        <div className={styles.numericKeyboardInput}>
          <div className={styles.passwordDisplay}>
            {displayedPassword}
          </div>
          <div className={styles.keyboard}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button 
                key={num} 
                className={styles.key} 
                onClick={(e) => handleKeyClick(num.toString(), e)}
              >
                {num}
              </button>
            ))}
            <div className={styles.row}>
              <button className={styles.key} onClick={handleBackspace}>
                <Delete size={24} />
              </button>
              <button 
                className={`${styles.key} ${styles.zero}`} 
                onClick={(e) => handleKeyClick('0', e)}
              >
                0
              </button>
              <button 
                className={`${styles.key} ${styles.clear}`} 
                onClick={handleClearPassword}
              >
                {showRetryIcon ? (
                  <RotateCcw size={24} />
                ) : (
                  <Trash2 size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default NumericKeyboard;