import { useContext } from 'react';
import AppContext from '../../../../app_context/AppContext.js';

export const useNumericKeyboardFunctions = (value, onChange, onPasswordComplete, onClear) => {
    const {
        MAX_PASSWORD_LENGTH,
        displayedPassword, 
        setDisplayedPassword        
    } = useContext(AppContext);

    const handleKeyClick = (num, e) => {
        e.preventDefault();
        if (displayedPassword.length < MAX_PASSWORD_LENGTH) {
            const newValue = displayedPassword + num;
            setDisplayedPassword(newValue);
            onChange(newValue);
            
            if (newValue.length === MAX_PASSWORD_LENGTH) {
                onPasswordComplete();
            }
        }
    };

    const handleBackspace = (e) => {
        e.preventDefault();
        if (displayedPassword.length > 0) {
          const newValue = displayedPassword.slice(0, -1);
          setDisplayedPassword(newValue);
          onChange(newValue);
        }
    };
      
    const handleClearPassword = (e) => {
        e.preventDefault();
        setDisplayedPassword('');
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