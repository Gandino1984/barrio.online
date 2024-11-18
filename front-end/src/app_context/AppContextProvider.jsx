import { useState } from 'react';
import AppContext from '../app_context/AppContext.js';

export const AppContextProvider = ({ children }) => {
  const [databaseResponse, setDatabaseResponse] = useState(true);

  const [isLoggingIn, setIsLoggingIn] = useState(true);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [userType, setUserType] = useState('client'); 


  // showBusinessSelector,
  // setShowBusinessSelector,
  // showPasswordLabel,
  //   setShowPasswordLabel,
  //   showPasswordRepeat,
  //   setShowPasswordRepeat,
  //   onPasswordComplete,
  //   onClear,  
  //   keyboardKey,
  //   setKeyboardKey,

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
    setUserType
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
