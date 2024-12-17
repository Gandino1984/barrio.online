import { useState, useEffect } from 'react';
import AppContext from '../app_context/AppContext.js';

export const AppContextProvider = ({ children }) => {

  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [showShopManagement, setshowShopManagement] = useState(false);
  const [error, setError] = useState('');
  
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

  // Initialize currentUser from localStorage:
  // a user is stored in the Local Storage when he logs, not on register
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUserData = localStorage.getItem('currentUser');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        console.log('-> Datos de usuario en el Local Storage = ', parsedData);
        return parsedData.user || null;
      } catch (error) {
        setError('Error al obtener los datos de sesión del usuario');
        console.error('-> Error al obtener los datos de sesión del usuario = ', error);
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
    
    // Explicitly set the current user to the entire user object
    setCurrentUser(userData);
  
    // Optional: Reset other states if needed
    setIsLoggingIn(false);
    setshowShopManagement(true);
  };

  // Custom logout function
  const logout = () => {
    //to-do: show modal to ask later if the user wants to log out
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsLoggingIn(true);
    setshowShopManagement(false);
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
  const [selectedShopType, setSelectedShopType] = useState(null);
  const [showShopCreationForm, setShowShopCreationForm] = useState(false);
  const [ipError, setIpError] = useState('');
  const [ip, setIp] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [userlocationError, setUserlocationError] = useState('');
  const [userTypeError, setUserTypeError] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [userType, setUserType] = useState(''); 
  const [userlocation, setUserlocation] = useState(''); 
  
  const [newShop, setNewShop] = useState({
    name_shop: '',
    type_shop: '',
    subtype_shop: '',
    location_shop: '',
    id_user: '',
    calificacion_shop: ''
  })

  const [shopType, setShopType] = useState('');


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
      options: ['Descuento'], 
    },
    calificacion: {
      label: 'Calificación',
      options: ['1', '2', '3', '4', '5'], 
    },
  });

  const [shopTypesAndSubtypes, setShopTypesAndSubtypes] = useState({
    'Artesania': ['Accesorios', 'Complementos', 'Varios'],
    'Bienestar': ['Peluqueria', 'Fisioterapia', 'Varios'],
    'Consultoria': ['Tecnica', 'Digital', 'Varios'],
    'Comida': [
      'Fruteria', 'Carniceria', 'Pescaderia', 'Panaderia', 
      'Local', 'Peruana', 'China', 'Japonesa', 'Italiana', 
      'Turca', 'Kebab', 'Restaurante', 'Varios'
    ],
    'Educativo': [
      'Clases Particulares', 'Asesoria', 'Charla', 
      'Presentacion', 'Clase Grupal', 'Investigacion', 'Varios'
    ],
    'Especializado': ['Diseno', 'Arte', 'Varios'],
    'Ropa': ['Infantil', 'Adultos', 'Intima', 'Alquiler', 'Boda', 'Varios'],
    'Servicios': ['Autonomos', 'Tecnico', 'Arte', 'Limpieza', 'Varios'],
    'Taller': ['Pintura', 'Escultura', 'Ilustracion', 'Diseno', 'Mecanico', 'Electrodomesticos', 'Varios']
  });

  const value = {
    isLoggingIn, setIsLoggingIn,
    username, setUsername,
    password, setPassword,
    passwordRepeat, setPasswordRepeat,
    MAX_PASSWORD_LENGTH,
    databaseResponse, setDatabaseResponse,
    userType, setUserType,
    shopType, setShopType,
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
    selectedShopType, setSelectedShopType,
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
    userlocationError, setUserlocationError,
    newShop, setNewShop,
    shopTypesAndSubtypes, setShopTypesAndSubtypes,
    userTypeError, setUserTypeError
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
