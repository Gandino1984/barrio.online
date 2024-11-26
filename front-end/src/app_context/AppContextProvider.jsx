import { useState, useEffect } from 'react';
import AppContext from '../app_context/AppContext.js';

export const AppContextProvider = ({ children }) => {

  // Function to check and clear expired user data
  const checkAndClearUserData = () => {
    const storedUserData = localStorage.getItem('currentUser');
    if (storedUserData) {
      const { timestamp } = JSON.parse(storedUserData);
      const currentTime = new Date().getTime();
      const NINE_DAYS_IN_MS = 9 * 24 * 60 * 60 * 1000;

      if (currentTime - timestamp > NINE_DAYS_IN_MS) {
        // Clear both localStorage and state if 9 days have passed
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
      }
    }
  };

  // Initialize currentUser from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUserData = localStorage.getItem('currentUser');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        return parsedData.user || null;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        return null;
      }
    }
    return null;
  });

  // Custom login function to handle both context and localStorage
  const login = (userData) => {
    // Create an object with user data and timestamp
    const userDataToStore = {
      user: userData,
      timestamp: new Date().getTime()
    };
    console.log('User data for local storage:', userDataToStore);
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(userDataToStore)); //is this needed?
    // Update context state
    setCurrentUser(userData);
  };

  // Custom logout function
  const logout = () => {
    // Remove from localStorage
    localStorage.removeItem('currentUser');
    // Clear context state
    setCurrentUser(null);
  };

  // Check for expired user data on component mount
  useEffect(() => {
    checkAndClearUserData();
  }, []);

  const [databaseResponse, setDatabaseResponse] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [displayedPassword, setDisplayedPassword] = useState('');
  const [userType, setUserType] = useState(''); 
  const MAX_PASSWORD_LENGTH = 4;
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [showPasswordLabel, setShowPasswordLabel] = useState(true);
  const [keyboardKey, setKeyboardKey] = useState(0);
  const [showBusinessSelector, setShowBusinessSelector] = useState(false);
  const [onPasswordComplete, setOnPasswordComplete] = useState(null);
  const [onClear, setOnClear] = useState(null);
  const [businessType, setBusinessType] = useState('general');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedShop, setSelectedShop] = useState(null);
  const [isAddingShop, setIsAddingShop] = useState(false);

  

  const value = {
    isLoggingIn,
    setIsLoggingIn,
    username,
    setUsername,
    password,
    setPassword,
    passwordRepeat,
    setPasswordRepeat,
    MAX_PASSWORD_LENGTH,
    databaseResponse,
    setDatabaseResponse,
    userType,
    setUserType,
    businessType, 
    setBusinessType,
    showBusinessSelector, setShowBusinessSelector,
    showPasswordRepeat, setShowPasswordRepeat,
    showPasswordLabel, setShowPasswordLabel,
    keyboardKey, setKeyboardKey,
    onPasswordComplete, setOnPasswordComplete,
    onClear, 
    setOnClear,
    displayedPassword, setDisplayedPassword,
    currentUser,
    login,
    logout,
    shops, setShops,
    loading, setLoading,
    error, setError,
    selectedShop, setSelectedShop,
    isAddingShop, setIsAddingShop
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
