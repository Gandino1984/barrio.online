import React, { useState, useContext } from 'react';
import  AppContext  from "../../../../general_app_context/AppContext.js";

import LoginRegisterContext from '../context/LoginRegisterContext.js';

export const LoginRegisterProvider = ({ children }) => {
  // Estados locales del componente
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [keyboardKey, setKeyboardKey] = useState(0);
  const [showPasswordLabel, setShowPasswordLabel] = useState(true);
  const [showBusinessSelector, setShowBusinessSelector] = useState(false);

  // Obtener estados globales necesarios del AppContext
  const {
    isLoggingIn,
    setIsLoggingIn,
    username,
    setUsername,
    password,
    setPassword,
    passwordRepeat,
    setPasswordRepeat,
    databaseResponse,
    userType,
    setUserType
  } = useContext(AppContext);

  const value = {
    // Estados locales
    showPasswordRepeat,
    setShowPasswordRepeat,
    keyboardKey,
    setKeyboardKey,
    showPasswordLabel,
    setShowPasswordLabel,
    showBusinessSelector,
    setShowBusinessSelector,

    // Estados globales
    isLoggingIn,
    setIsLoggingIn,
    username,
    setUsername,
    password,
    setPassword,
    passwordRepeat,
    setPasswordRepeat,
    databaseResponse,
    userType,
    setUserType
  };

  return (
    <LoginRegisterContext.Provider value={value}>
      {children}
    </LoginRegisterContext.Provider>
  );
};