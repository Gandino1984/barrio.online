import { useState, useEffect } from 'react';
import AppContext from '../app_context/AppContext.js';

export const AppContextProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(() => { 
    const storedUserData = localStorage.getItem('currentUser');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        
        if (!parsedData || typeof parsedData !== 'object' || !parsedData.username) {
          console.error('-> AppContextProvider.jsx - Estrucutra de datos de usuario inválida');
          localStorage.removeItem('currentUser');
          return null;
        }
        return parsedData;
      } catch (err) {
        console.error('-> AppContextProvider.jsx - Error = ', err);
        localStorage.removeItem('currentUser');
        return null;
      }
    }
    return null;
  });

  //initializes isLoggingIn with the negation of currentUser, 
  const [isLoggingIn, setIsLoggingIn] = useState(() => !currentUser);
  // initializes showShopManagement with the boolean value of currentUser.
  const [showShopManagement, setshowShopManagement] = useState(() => !!currentUser);
  const [showProductManagement, setshowProductManagement] = useState(false);


  const [username, setUsername] = useState(() => currentUser?.username || '');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [userType, setUserType] = useState(() => currentUser?.userType || '');
  const [userlocation, setUserlocation] = useState(() => currentUser?.userlocation || '');

  const [showErrorCard, setShowErrorCard] = useState(false);

  const [error, setError] = useState({
    userError: '',
    passwordError: '',
    passwordRepeatError: '',
    ipError: '',
    userlocationError: '',
    userTypeError: '',
    databaseResponseError: '',
    shopError: ''
  });


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

  const clearError = () => {
    setError({
      userError: '',
      passwordError: '',
      passwordRepeatError: '',
      ipError: '',
      userlocationError: '',
      userTypeError: '',
      databaseResponseError: '',
    });
    setShowErrorCard(false);
  };

  const login = (userData) => {
    // Remove the password and ensure we have required fields
    const { password, ...userWithoutPassword } = userData;
    
    if (!userWithoutPassword.username) {
      console.error('Invalid user data structure');
      return;
    }
  
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    setCurrentUser(userWithoutPassword);
  
    setIsLoggingIn(false);
    setshowShopManagement(true);
  };

  const logout = () => {
    //to-do: show modal to ask later if the user wants to log out
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsLoggingIn(true);
    setshowShopManagement(false);
  };

  const MAX_PASSWORD_LENGTH = 4;

  const [databaseResponse, setDatabaseResponse] = useState(true);
  const [displayedPassword, setDisplayedPassword] = useState('');
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [showPasswordLabel, setShowPasswordLabel] = useState(true);
  const [keyboardKey, setKeyboardKey] = useState(0);
  const [onPasswordComplete, setOnPasswordComplete] = useState(null);
  const [onClear, setOnClear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRepeatPasswordMessage, setShowRepeatPasswordMessage] = useState(false);
 
  const [isAddingShop, setIsAddingShop] = useState(false);
  const [selectedShopType, setSelectedShopType] = useState(null);
  const [showShopCreationForm, setShowShopCreationForm] = useState(false);
  const [ipError, setIpError] = useState('');
  const [ip, setIp] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [userlocationError, setUserlocationError] = useState('');
  const [userTypeError, setUserTypeError] = useState('');
  
  const [newShop, setNewShop] = useState({
    name_shop: '',
    type_shop: '',
    subtype_shop: '',
    location_shop: '',
    id_user: '',
    calification_shop: 0, 
    image_shop: ''
  })
  const [selectedShop, setSelectedShop] = useState(null);
  const [shopType, setShopType] = useState('');
  const [shops, setShops] = useState([]);
  const [shopTypes, setShopTypes] = useState([]);

  const [shopTypesAndSubtypes, setShopTypesAndSubtypes] = useState({
    'Artesanía': ['Accesorios', 'Complementos', 'Varios'],
    'Bienestar': ['Peluquería', 'Fisioterapia', 'Osteopatía','Perfumería', 'Parafarmacia', 'Yoga', 'Varios'],
    'Consultoría': ['Técnica', 'Digital', 'Formativa', 'Varios'],
    'Comida': [
      'Fruteria', 'Carniceria', 'Asador', 'Pescaderia', 'Panaderia', 
      'Local', 'Peruana', 'China', 'Japonesa', 'Italiana', 
      'Turca', 'Kebab', 'Restaurante', 'Varios'
    ],
    'Educativo': [
      'Librería', 'Curso', 'Clase Particular', 'Asesoría', 'Charla', 
      'Presentación', 'Clase Grupal', 'Investigación', 'Varios'
    ],
    'Especializado': ['Vinoteca', 'Diseño', 'Estudio', 'Editorial', 'Tabaco', 'Arte', 'Estanco', 'Varios'],
    'Entretenimiento': ['Teatro', 'Música', 'Danza', 'Escape Room', 'Varios'],
    'Ropa': ['Infantil', 'Adulto', 'Hombre', 'Mujer', 'No binario' , 'Niño', 'Niña', 'Lencería', 'Alquiler', 'Boda', 'Varios'],
    'Servicios': ['Autónomo', 'Técnico', 'Fotografía', 'Arte', 'Limpieza', 'Pintura', 'Varios'],
    'Taller': ['Pintura', 'Escultura', 'Ilustración', 'Diseno', 'Mecánico', 'Electrodoméstico', 'Varios']
  });
  
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

    // Check for expired user data on component mount
    useEffect(() => {
      checkAndClearUserData();
    }, []);

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
    currentUser, setCurrentUser,
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
    userTypeError, setUserTypeError,
    showErrorCard, setShowErrorCard,
    showRepeatPasswordMessage,
    setShowRepeatPasswordMessage, clearError
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
