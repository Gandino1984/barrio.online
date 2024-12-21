import React, { useContext } from 'react';
import AppContext from '../../../src/app_context/AppContext.js';

export const TopBarFunctions = () => {

    const {
        setIsLoggingIn, setUsername, 
        setPassword, setPasswordRepeat,
        setShowPasswordLabel, setKeyboardKey, 
        setshowShopManagement, setDisplayedPassword, 
        setUserType, logout, setUsernameError,
        showShopManagement, setShowShopCreationForm,
        showShopCreationForm, selectedShop, setSelectedShop,
        setCurrentUser 
    } = useContext(AppContext);

    const handleBack = () => {
        if (showShopCreationForm) {
            // If on shop creation form, go back to shop management
            setShowShopCreationForm(false);
            setshowShopManagement(true);
        } else if (selectedShop) {
            // If a shop is selected, deselect it
            setSelectedShop(null);
            setshowShopManagement(true);
        } else if (showShopManagement) {
            // If on shop management, go back to login/initial state
            setshowShopManagement(false);
            setIsLoggingIn(true);
        }
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
        setCurrentUser(null); 
        localStorage.removeItem('currentUser'); 
    };

    return {
        handleBack,
        clearUserSession
  };
};
