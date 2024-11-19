import { useContext } from 'react';
import AppContext from '../../../../app_context/AppContext.js';

export const useNumericKeyboardFunctions = () => {
    const {
        MAX_PASSWORD_LENGTH,
        onPasswordComplete, 
        setOnPasswordComplete,
        displayedPassword, 
        setDisplayedPassword        
    } = useContext(AppContext);

    const handleKeyClick = (num, e) => {
        e.preventDefault();
        if (displayedPassword.length < MAX_PASSWORD_LENGTH) {
            const newValue = value + num;
            setDisplayedPassword(newValue);
            
            if (newValue.length === MAX_PASSWORD_LENGTH) {
                setOnPasswordComplete(true);
            }
        }
    };

    const handleBackspace = (e) => {
        e.preventDefault();
        if (displayedPassword.length > 0) {
          const newValue = displayedPassword.slice(0, -1);
          setDisplayedPassword(newValue);
        }
      };
      
    const handleClearPassword = (e, onClear) => {
        e.preventDefault();
        onChange('');
        if (onClear) {
          onClear();
        }
      };

  return {
    handleKeyClick,
    handleBackspace,
    handleClearPassword
  };
};