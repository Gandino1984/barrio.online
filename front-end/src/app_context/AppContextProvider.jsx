import { useState, useEffect } from 'react';
import AppContext from '../app_context/AppContext.js';

export const AppContextProvider = ({ children }) => {

  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [showShopManagement, setshowShopManagement] = useState(false);
  
  // Function to check and clear expired user data
  const checkAndClearUserData = () => {
    const storedUserData = localStorage.getItem('currentUser');
    
    setCurrentUser(storedUserData);
    
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
  // if there's a user in local storage the app shouldn't
  // go through login/registration
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUserData = localStorage.getItem('currentUser');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        console.log('-> Datos de usuario en el Local Storage:', parsedData);
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
    const userDataToStore = {
      user: userData,
      timestamp: new Date().getTime()
    };
    console.log('-> User data for local storage = ', userDataToStore);

    localStorage.setItem('currentUser', JSON.stringify(userDataToStore)); 
    
    setCurrentUser(userData);
    
    // just added
    // setShops([]);
  };

  // Custom logout function
  const logout = () => {
    //to-do: ask later if the user to log out
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  // Check for expired user data on component mount
  useEffect(() => {
    checkAndClearUserData();
  }, []);

  const MAX_PASSWORD_LENGTH = 4;

  const [databaseResponse, setDatabaseResponse] = useState(true);
  const [displayedPassword, setDisplayedPassword] = useState('');
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [showPasswordLabel, setShowPasswordLabel] = useState(true);
  const [keyboardKey, setKeyboardKey] = useState(0);
  const [onPasswordComplete, setOnPasswordComplete] = useState(null);
  const [onClear, setOnClear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null);
  const [isAddingShop, setIsAddingShop] = useState(false);
  const [selectedBusinessType, setSelectedBusinessType] = useState(null);
  const [showShopCreationForm, setShowShopCreationForm] = useState(false);
  const [ipError, setIpError] = useState('');
  const [ip, setIp] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [userlocationError, setUserlocationError] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [userType, setUserType] = useState(''); 
  const [userlocation, setUserlocation] = useState(''); 
  
  const [businessType, setBusinessType] = useState('general');
  const [shops, setShops] = useState([]);
  const [shopTypes, setShopTypes] = useState([]);
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    temporada: null,
    tipo: null,
    oferta: null,
    calificacion: null,
  });
  const [filterOptions, setFilterOptions] = useState({
    temporada: {
      label: 'Temporada',
      options: ['Primavera', 'Verano', 'Otoño', 'Invierno', 'Todo el Año'],
    },
    tipo: {
      label: 'Tipo',
      options: ['Todos'],
    },
    oferta: {
      label: 'Oferta',
      options: [], 
    },
    calificacion: {
      label: 'Calificación',
      options: ['1', '2', '3', '4', '5'], 
    },
  });

  const value = {
    isLoggingIn, setIsLoggingIn,
    username, setUsername,
    password, setPassword,
    passwordRepeat, setPasswordRepeat,
    MAX_PASSWORD_LENGTH,
    databaseResponse, setDatabaseResponse,
    userType, setUserType,
    businessType, setBusinessType,
    showShopManagement, setshowShopManagement,
    showPasswordRepeat, setShowPasswordRepeat,
    showPasswordLabel, setShowPasswordLabel,
    keyboardKey, setKeyboardKey,
    onPasswordComplete, setOnPasswordComplete,
    onClear, setOnClear,
    displayedPassword, setDisplayedPassword,
    currentUser,
    login, logout,
    shops, setShops,
    loading, setLoading,
    selectedShop, setSelectedShop,
    isAddingShop, setIsAddingShop,
    selectedBusinessType, setSelectedBusinessType,
    showShopCreationForm, setShowShopCreationForm,
    products, setProducts,
    usernameError, setUsernameError,
    ipError, setIpError,
    error, setError,
    filterOptions, setFilterOptions,
    filters, setFilters,
    filteredProducts, setFilteredProducts,
    shopTypes, setShopTypes,
    passwordError, setPasswordError,
    ip, setIp,
    checkAndClearUserData,
    userlocation, setUserlocation,
    userlocationError, setUserlocationError
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
