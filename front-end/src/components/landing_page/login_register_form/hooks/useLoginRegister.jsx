import { useContext, useState } from 'react';
import AppContext from '../../../../app_context/AppContext.js';
import { useUsernameValidation } from './useUsernameValidation.jsx';

export const useLoginRegister = () => {
    const {
      isLoggingIn,
      setIsLoggingIn,
      username,
      setUsername,
      password,
      setPassword,
      passwordRepeat,
      showPasswordRepeat,
      setPasswordRepeat,
      setShowPasswordRepeat,
      setShowPasswordLabel,
      setKeyboardKey,
      setShowBusinessSelector,
      databaseResponse,
      setDisplayedPassword,
      userType,
      setUserType
    } = useContext(AppContext);

    const [usernameError, setUsernameError] = useState('');
    const { validateUsername, cleanupUsername } = useUsernameValidation();

    const handleUsernameChange = (e) => {
        const rawValue = e.target.value;
        // Clean up the username as the user types
        const cleanedValue = cleanupUsername(rawValue);
        setUsername(cleanedValue);
        // Clear any previous errors
        setUsernameError('');
    };

    const handlePasswordComplete = (isLogin) => () => {
        if (!isLogin) {
            setDisplayedPassword('');
            setShowPasswordRepeat(true);
            setKeyboardKey((prev) => prev + 1);
        } else {
            setShowPasswordLabel(false);
        }
    };

    const handleClear = (isLogin) => () => {
        if (!isLogin) {
            if (showPasswordRepeat) {
              // If we're in the repeat password screen, reset everything
                setPassword('');
                setPasswordRepeat('');
                setDisplayedPassword('');
                setShowPasswordRepeat(false);
                setShowPasswordLabel(true);
                setKeyboardKey((prev) => prev + 1);
            } else {
              // If we're in the first password screen, just clear that password
                setPassword('');
                setDisplayedPassword('');
            }
          } else {
              setPassword('');
              setDisplayedPassword('');
              setShowPasswordLabel(true);
          }
    };

    const handlePasswordChange = (isLogin, newPassword) => {
        if (!isLogin && showPasswordRepeat) {
            setPasswordRepeat(newPassword);
        } else {
            setPassword(newPassword);
        }   
        if (isLogin && newPassword.length !== 4) {
            setShowPasswordLabel(true);
        }
    };

    const handleRepeatPasswordChange = (newPassword) => {
        setPasswordRepeat(newPassword);
    };

    const toggleForm = () => {
        setIsLoggingIn((prevState) => !prevState);
        setUsername('');
        setPassword('');
        setPasswordRepeat('');
        setDisplayedPassword('');
        setShowPasswordRepeat(false);
        setShowPasswordLabel(true);
        setKeyboardKey((prev) => prev + 1);
    };

    const isButtonDisabled = () => {
      const { isValid } = validateUsername(username);
      if (!isValid) return true;

      if (isLoggingIn) {
          return password.length !== 4;
      } else {
          return password.length !== 4 || passwordRepeat.length !== 4 || password !== passwordRepeat;
      }
  };
    
    const handleFormSubmit = async (e) => {
      e.preventDefault();
      
      // Final validation before submission
      const { isValid, cleanedUsername, errors } = validateUsername(username);
      
      if (!isValid) {
          setUsernameError(errors[0]); // Show the first error
          return;
      }

      // Update the username one final time with the cleaned version
      setUsername(cleanedUsername);

      if (!isButtonDisabled()) {
          // Proceed with form submission
          if (databaseResponse) {
              setShowBusinessSelector(true);
          }
      }
  };



    const handleBusinessSelect = (businessType) => {
        console.log('Selected business:', businessType);
      // Additional business selection logic
    };

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    return {
      handlePasswordComplete,
      handleClear,
      handlePasswordChange,
      handleRepeatPasswordChange,
      isButtonDisabled,
      toggleForm,
      handleBusinessSelect,
      handleFormSubmit,
      handleUserTypeChange,
      handleUsernameChange,
      usernameError
  };
};