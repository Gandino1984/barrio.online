import { useContext } from 'react';
import AppContext from '../../../../app_context/AppContext.js';

export const useNumericKeyboardFunctions = (value, onChange, onPasswordComplete, onClear) => {
    const {
        MAX_PASSWORD_LENGTH,
        // displayedPassword, 
        setDisplayedPassword,
        isLoggingIn        
    } = useContext(AppContext);

    // const handleKeyClick = (num, e) => {
    //     e.preventDefault();
    //     if (displayedPassword.length < MAX_PASSWORD_LENGTH) {
    //         const newValue = displayedPassword + num;
    //         setDisplayedPassword(newValue);
    //         onChange(newValue);
            
    //         if (newValue.length === MAX_PASSWORD_LENGTH) {
    //             onPasswordComplete();
    //         }
    //     }
    // };

    const handleKeyClick = (num, e) => {
        e.preventDefault();
        if (value.length < MAX_PASSWORD_LENGTH) {
            const newValue = value + num;
            // Update the actual password value
            onChange(newValue);
            // Update the displayed (masked) value
            setDisplayedPassword('*'.repeat(newValue.length));
            
            if (newValue.length === MAX_PASSWORD_LENGTH) {
                onPasswordComplete();
            }
        }
    };

    // const handleBackspace = (e) => {
    //     e.preventDefault();
    //     if (displayedPassword.length > 0) {
    //       const newValue = displayedPassword.slice(0, -1);
    //       setDisplayedPassword(newValue);
    //       onChange(newValue);
    //     }
    // };

    const handleBackspace = (e) => {
        e.preventDefault();
        if (value.length > 0) {
          const newValue = value.slice(0, -1);
          // Update both actual and displayed values
          onChange(newValue);
          setDisplayedPassword('*'.repeat(newValue.length));
        }
    };
      
    const handleClearPassword = (e) => {
        e.preventDefault();
        onChange('');
        setDisplayedPassword('');
        if (onClear) {
          onClear();
        }
    };

        /**
     * Handles clearing of password fields
     * @param {boolean} isLogin - Whether in login mode
     * @returns {Function} Callback function for clearing fields
     */
        const handleClear = (isLogin) => () => {
            if (!isLogin) {
                if (showPasswordRepeat) {
                    setPassword('');
                    setPasswordRepeat('');
                    setDisplayedPassword('');
                    setShowPasswordRepeat(false);
                    setShowPasswordLabel(true);
                    setKeyboardKey((prev) => prev + 1);
                } else {
                    setPassword('');
                    setDisplayedPassword('');
                }
            } else {
                setPassword('');
                setDisplayedPassword('');
                setShowPasswordLabel(true);
            }
        };

    return {
        handleKeyClick,
        handleBackspace,
        handleClearPassword,
        handleClear
    };
};