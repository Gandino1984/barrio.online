import React, { useContext } from 'react';
import AppContext from '../../../src/app_context/AppContext.js';
import { useNavigate } from 'react-router-dom';

export const TopBarFunctions = () => {

    const {
        setIsLoggingIn, setUsername, 
        setPassword, setPasswordRepeat,
        setShowPasswordLabel, setKeyboardKey, 
        setshowShopManagement, setDisplayedPassword, 
        setUserType, logout, setUsernameError
    } = useContext(AppContext);

    const handleBack = () => {
      
    };

    const clearUserSession = () => {
        logout();
        setUsername('');
        setPassword('');
        setPasswordRepeat('');
        setDisplayedPassword('');
        setShowPasswordLabel(true);
        setKeyboardKey((prev) => prev + 1);
        setIsLoggingIn(true);
        setshowShopManagement(false);
        setUsernameError('');
        setUserType('');
    };

    return {
        handleBack,
        clearUserSession
  };
};
