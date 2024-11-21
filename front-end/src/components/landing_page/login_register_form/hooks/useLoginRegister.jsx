import { useContext, useState } from 'react';
import AppContext from '../../../../app_context/AppContext.js';
import { useUsernameValidation } from './useUsernameValidation.jsx';
import axios from '../utils/axiosConfig';

export const useLoginRegister = () => {
    const {
      isLoggingIn,
      setIsLoggingIn,
      username,
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
      setUserType,
      currentUser, 
      login, 
      logout 
    } = useContext(AppContext);

    const [usernameError, setUsernameError] = useState('');
    const { validateUsername, cleanupUsername } = useUsernameValidation();

    const handleUsernameChange = (e) => {
        const rawValue = e.target.value;
        // Clean up the username as the user types
        const cleanedValue = cleanupUsername(rawValue);
        setUsername(cleanedValue);
        // Clear any previous errors
        setUsernameError('');
    };

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
      const { isValid } = validateUsername(username);
      if (!isValid) return true;

      if (isLoggingIn) {
          return password.length !== 4;
      } else {
          return password.length !== 4 || passwordRepeat.length !== 4 || password !== passwordRepeat;
      }
  };
    
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Final validation before submission
    const { isValid, cleanedUsername, errors } = validateUsername(username);
    if (!isValid) {
        setUsernameError(errors[0]); // Show the first error
        return;
    }
    // Update the username one final time with the cleaned version
    setUsername(cleanedUsername);
    if (!isButtonDisabled()) {
        // *********** Login scenario
        if (isLoggingIn) {
            // First, check if there's an existing user in localStorage
            if (currentUser && currentUser.username.toLowerCase() === cleanedUsername.toLowerCase()) {
                if (currentUser.password === password) {
                    // Local storage login successful
                    setShowBusinessSelector(true);
                    return;
                } else {
                    // Password mismatch in local storage
                    // Proceed to database check
                    try {
                        const response = await axios.post('login/check', {
                            name_user: cleanedUsername,
                            pass_user: password
                        });
                        if (response.data.error) {
                            setUsernameError(response.data.error);
                            return;
                        }
                        // Successful database login
                        const userData = {
                            username: response.data.data.name_user,
                            password: password,
                            userType: response.data.data.type_user,
                            id: response.data.data.id_user
                        };
                        // Update local storage and context
                        login(userData);
                        setShowBusinessSelector(true);
                    } catch (error) {
                        setUsernameError('Error de inicio de sesión');
                        console.error('Login error:', error);
                    }
                }
            } 
            // No user in local storage, check database
            else {
                try {
                    const response = await axios.post('login/check', {
                        name_user: cleanedUsername,
                        pass_user: password
                    });
                    if (response.data.error) {
                        setUsernameError(response.data.error);
                        return;
                    }
                    // Successful database login
                    const userData = {
                        username: response.data.data.name_user,
                        password: password,
                        userType: response.data.data.type_user,
                        id: response.data.data.id_user
                    };
                    // Update local storage and context
                    login(userData);
                    setShowBusinessSelector(true);
                } catch (error) {
                    setUsernameError('Error de inicio de sesión');
                    console.error('Login error:', error);
                }
            }
        } 
        // ********** Registration scenario
        else {
            // Check if a user already exists in local storage
            if (currentUser) {
                setUsernameError('Ya existe un usuario registrado. Cierre sesión primero.');
                return;
            }
            try {
                const response = await axios.post('/register/new', {
                    name_user: cleanedUsername,
                    pass_user: password,
                    type_user: userType,
                    location_user: '' // You might want to add location logic later
                });
                if (response.data.error) {
                    setUsernameError(response.data.error);
                    return;
                }
                // Successful registration
                const userData = {
                    username: cleanedUsername,
                    password: password,
                    userType: userType,
                    id: response.data.data.id_user
                };
                // Update local storage and context
                login(userData);
                setShowBusinessSelector(true);
            } catch (error) {
                setUsernameError('Error en el registro');
                console.error('Registration error:', error);
            }
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
      handleUserTypeChange,
      handleUsernameChange,
      usernameError
  };
};