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
  error = false 
}) => {

  const {
    MAX_PASSWORD_LENGTH,
    displayedPassword,
    setDisplayedPassword,
    isLoggingIn,
    password,
    passwordRepeat,
    showPasswordRepeat,
    setUsernameError,
    setPasswordError
  } = useContext(AppContext);

  const maskedValue = showMaskedPassword ? '*'.repeat(value.length) : value;

  const showRetryIcon = (!isLoggingIn && showPasswordRepeat) && (passwordRepeat.length === MAX_PASSWORD_LENGTH) && (password !== passwordRepeat);

  const {
    handleKeyClick,
    handleBackspace,
    handleClearPassword,
    handleClear
  } = useNumericKeyboardFunctions(value, onChange, onPasswordComplete);

  useEffect(() => {
    setDisplayedPassword(maskedValue);
  }, [value, showMaskedPassword]);

  const handleBackspaceClick = (e) => {
    handleBackspace(e);
    if (error) {
      // Reset both username and password errors when backspace is clicked
      setUsernameError('');
      setPasswordError('');
    }
  };

  return (
      <div className={styles.container}>
          <div className={`${styles.passwordDisplay} ${error ? 'text-red-500' : ''}`}>
              {displayedPassword}
          </div>
          <div className={styles.keyboard}>
              <div className={styles.row}>
                  {[1, 2, 3].map(num => (
                      <button 
                        key={num} 
                        className={styles.key} 
                        onClick={(e) => handleKeyClick(num.toString(), e)}
                      >
                          {num}
                      </button>
                  ))}
              </div>
              <div className={styles.row}>
                  {[4, 5, 6].map(num => (
                      <button 
                        key={num} 
                        className={styles.key} 
                        onClick={(e) => handleKeyClick(num.toString(), e)}
                      >
                          {num}
                      </button>
                  ))}
              </div>
              <div className={styles.row}>
                  {[7, 8, 9].map(num => (
                      <button 
                        key={num} 
                        className={styles.key} 
                        onClick={(e) => handleKeyClick(num.toString(), e)}
                      >
                          {num}
                      </button>
                  ))}
              </div>
              <div className={styles.row}>
                 
                  <button 
                    className={`${styles.key} ${styles.zero}`} 
                    onClick={(e) => handleKeyClick('0', e)}
                  >
                      0
                  </button>
                  <button 
                    className={`${styles.key} ${styles.clear}`} 
                    onClick={(e) => handleBackspaceClick(e)}
                  >
                      {showRetryIcon ? (
                        <RotateCcw size={16} />
                      ) : (
                        <Delete size={16} />
                      )}
                  </button>
              </div>
          </div>
    </div>
  );
};

export default NumericKeyboard;