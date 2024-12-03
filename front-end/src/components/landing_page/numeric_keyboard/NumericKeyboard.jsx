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
  onClear,
  error = false 
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

  const maskedValue = showMaskedPassword ? '*'.repeat(value.length) : value;

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
    setDisplayedPassword(maskedValue);
  }, [value, showMaskedPassword]);

  return (
      <div className={styles.container}>
          <div className={styles.numericKeyboardInput}>
              <div className={`${styles.passwordDisplay} ${error ? 'text-red-500' : ''}`}>
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
                          <Delete size={16} />
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
                            <RotateCcw size={16} />
                          ) : (
                            <Trash2 size={16} />
                          )}
                      </button>
                  </div>
              </div>
          </div>
    </div>
  );
};

export default NumericKeyboard;