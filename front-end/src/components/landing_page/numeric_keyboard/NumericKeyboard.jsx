import React, { useState, useEffect } from 'react';
import { useNumericKeyboard } from './hooks/numericKeyboardFunctions';
import styles from './NumericKeyboard.module.css';

const NumericKeyboard = ({ value, onChange, showMaskedPassword = false, onPasswordComplete, onClear }) => {
  const [displayedPassword, setDisplayedPassword] = useState('');
  const MAX_PASSWORD_LENGTH = 4;

  const { handleKeyClick, handleBackspace, handleClearPassword } = useNumericKeyboard(
    value,
    onChange,
    MAX_PASSWORD_LENGTH,
    onPasswordComplete
  );

  useEffect(() => {
    setDisplayedPassword('*'.repeat(value.length));
  }, [value]);

  return (
    <div className={styles.numericKeyboardInput}>
      <div className={styles.passwordDisplay}>
        {displayedPassword}
      </div>
      <div className={styles.keyboard}>
        <div className={styles.row}>
          <button className={styles.key} onClick={(e) => handleKeyClick('1', e)}>1</button>
          <button className={styles.key} onClick={(e) => handleKeyClick('2', e)}>2</button>
          <button className={styles.key} onClick={(e) => handleKeyClick('3', e)}>3</button>
        </div>
        <div className={styles.row}>
          <button className={styles.key} onClick={(e) => handleKeyClick('4', e)}>4</button>
          <button className={styles.key} onClick={(e) => handleKeyClick('5', e)}>5</button>
          <button className={styles.key} onClick={(e) => handleKeyClick('6', e)}>6</button>
        </div>
        <div className={styles.row}>
          <button className={styles.key} onClick={(e) => handleKeyClick('7', e)}>7</button>
          <button className={styles.key} onClick={(e) => handleKeyClick('8', e)}>8</button>
          <button className={styles.key} onClick={(e) => handleKeyClick('9', e)}>9</button>
        </div>
        <div className={styles.row}>
          <button className={styles.key} onClick={handleBackspace}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z" />
            </svg>
          </button>
          <button className={`${styles.key} ${styles.zero}`} onClick={(e) => handleKeyClick('0', e)}>0</button>
          <button className={`${styles.key} ${styles.clear}`} onClick={(e) => handleClearPassword(e, onClear)}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NumericKeyboard;