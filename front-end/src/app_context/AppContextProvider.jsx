import { useState } from 'react';
import AppContext from '../app_context/AppContext.js';

export const AppContextProvider = ({ children }) => {

  const [databaseResponse, setDatabaseResponse] = useState(true);

  const [isLoggingIn, setIsLoggingIn] = useState(true);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [userType, setUserType] = useState('client'); 

  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [showPasswordLabel, setShowPasswordLabel] = useState(true);
  const [keyboardKey, setKeyboardKey] = useState(0);
  const [showBusinessSelector, setShowBusinessSelector] = useState(false);
  const [onPasswordComplete, setOnPasswordComplete] = useState(null);
  const [onClear, setOnClear] = useState(null);
  const [businessType, setBusinessType] = useState('general');

  const value = {
    isLoggingIn,
    setIsLoggingIn,
    username,
    setUsername,
    password,
    setPassword,
    passwordRepeat,
    setPasswordRepeat,
    databaseResponse,
    setDatabaseResponse,
    userType,
    setUserType,
    businessType, 
    setBusinessType,
    showBusinessSelector, 
    setShowBusinessSelector,
    showPasswordRepeat, 
    setShowPasswordRepeat,
    showPasswordLabel, 
    setShowPasswordLabel,
    keyboardKey, 
    setKeyboardKey,
    onPasswordComplete, 
    setOnPasswordComplete,
    onClear, 
    setOnClear
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
