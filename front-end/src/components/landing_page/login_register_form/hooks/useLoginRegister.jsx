import { useContext } from 'react';
import AppContext from '../../../../app_context/AppContext.js';

export const useLoginRegister = () => {
    const {
        isLoggingIn,
        setIsLoggingIn,
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
        if (isLoggingIn) {
            return password.length !== 4;
        } else {
            return password.length !== 4 || passwordRepeat.length !== 4 || password !== passwordRepeat;
        }
    };
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!isButtonDisabled()) {
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
        handleUserTypeChange
    };
};