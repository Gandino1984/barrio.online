import { useContext, useState } from 'react';
import AppContext from '../../../../app_context/AppContext.js';
import { useUsernameValidation } from './useUsernameValidation.jsx';
import { useIPValidation } from './useIpValidation.jsx';
import axiosInstance from '../../../../../utils/axiosConfig.js';

export const LoginRegisterFunctions = () => {
    const {
        isLoggingIn, setIsLoggingIn, username, 
        setUsername, password, setPassword,
        passwordRepeat, showPasswordRepeat, setPasswordRepeat,
        setShowPasswordRepeat, setShowPasswordLabel, setKeyboardKey, setshowShopManagement, setDisplayedPassword, userType, 
        setUserType, currentUser, login, logout,
        setIsAddingShop, setShops, usernameError, 
        setUsernameError, passwordError, setPasswordError,
        userlocation, setUserlocation,
        userlocationError, setUserlocationError
    } = useContext(AppContext);

    // Custom hooks for validation
    const { validateUsername } = useUsernameValidation();

    const { ipError, validateIPRegistration } = useIPValidation();

    const handleUsernameChange = (e) => {
        const rawUsername = e.target.value;
        console.log('-> LOGIN: Username rawValue= ', rawUsername);
        setUsername(rawUsername);
        // setUsernameError('');
      };
    
      const handleUserLocationChange = (ev) => {
      const location = ev.target.value;
      console.log('-> REGISTER: userlocation value= ', location);
      setUserlocation(location);
      // setUserlocationError('');
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


    const handlePasswordChange = (isLogin, newPassword) => {
        if (!isLogin && showPasswordRepeat) {
            setPasswordRepeat(newPassword);
            setDisplayedPassword('*'.repeat(newPassword.length));
        } else {
            setPassword(newPassword);
            setDisplayedPassword('*'.repeat(newPassword.length));
        }   
        if (isLogin && newPassword.length !== 4) {
            setShowPasswordLabel(true);
        }
    };


    const handleRepeatPasswordChange = (newPassword) => {
        setPasswordRepeat(newPassword);
        setDisplayedPassword('*'.repeat(newPassword.length));
    };


    const clearUserSession = () => {
      logout();
      setUsername('');
      setPassword('');
      setPasswordRepeat('');
      setDisplayedPassword('');
      setShowPasswordLabel(true);
      setKeyboardKey((prev) => prev + 1);
      setshowShopManagement(false);
      setUsernameError('');
      setUserType('');
  };


  const toggleForm = () => {
      setIsLoggingIn((prevState) => !prevState);
      clearUserSession();
  };

  const handleLoginResponse = async (response) => {
      if (!response.data) {
          console.log('-> handleLoginResponse() - No se recibió respuesta del servidor en el login');
          throw new Error('Login - No se recibió respuesta del servidor en el login');
      }

      if (response.data.error) {
          console.log('-> handleLoginResponse() - Error en el login:', response.data.error);
          throw new Error(response.data.error);
      }

      const userData = response.data.data;

      console.log('-> handleLoginResponse() - userData = ', userData);

      // check the database response in depth
      if (!userData || !userData.id_user || !userData.name_user || !userData.type_user) {
          console.log('-> handleLoginResponse() - Datos de usuario incompletos o inválidos');
          //just added 
          clearUserSession();
          throw new Error('Datos de usuario incompletos o inválidos');
      }

      setUserType(userData.type_user);
      // Normalize user data structure using the server-provided user type
      const normalizedUserData = {
        id: userData.id_user, 
        username: userData.name_user,
        password: password,
        userType: userData.type_user 
      };


      login(normalizedUserData);

      // Special handling for seller type
      if (userData.type_user === 'seller') {
          try {
              // Fetch shops specifically for the logged-in seller
              const shopsResponse = await axiosInstance.post('/shop/user', {
                  id_user: userData.id_user
              });
              
              const userShops = shopsResponse.data.data || [];
              
              // If no shops exist, open the shop creation form
              if (userShops.length === 0) {
                  setIsAddingShop(true);
                  setshowShopManagement(false);
              } else {
                  // Set the shops owned by this specific seller
                  setShops(userShops);
                  setshowShopManagement(true);
                  setIsAddingShop(false);
              }
          } catch (error) {
              console.error('-> handleLoginResponse() - El usuario no tiene tiendas:', error);
              console.log('-> handleLoginResponse() - Renderizando el formulario para crear tienda');
              setIsAddingShop(true);
              setshowShopManagement(false);
          }
      }else {
          // For other user types (client, provider), show business selector
          setshowShopManagement(true);
      }
  };


  const handleRegistrationResponse = async (response) => {
      if (!response.data) {
          throw new Error('No se recibió respuesta del servidor');
      }
      if (response.data.error) {
          throw new Error(response.data.error);
      }
      const userData = response.data.data;
      if (!userData || !userData.id_user) {
          throw new Error('Error en el registro: datos de usuario incompletos');
      }
      const normalizedUserData = {
          id: userData.id_user,
          username: userData.name_user,
          password: password,
          userType: userType,
      };

      login(normalizedUserData);
      setshowShopManagement(true); 
  };


    // const validateForm = (cleanedUsername) => {
    //     if (!cleanedUsername || cleanedUsername.trim() === '') {
    //         return { isValid: false, error: 'El nombre de usuario es requerido' };
    //     }
    //     if (!password || password.length !== 4) {
    //         return { isValid: false, error: 'La contraseña debe tener 4 dígitos' };
    //     }
    //     if (!isLoggingIn) {
    //         if (!passwordRepeat || passwordRepeat.length !== 4) {
    //             return { isValid: false, error: 'La confirmación de contraseña debe tener 4 dígitos' };
    //         }
    //         if (password !== passwordRepeat) {
    //             return { isValid: false, error: 'Las contraseñas no coinciden' };
    //         }
    //         if (!userType) {
    //             return { isValid: false, error: 'Debe seleccionar un tipo de usuario' };
    //         }
    //     }
    //     return { isValid: true, error: null };
    // };


  const handleLogin = async (cleanedUsername, password) => {
      try {
        // Fetch user details first
        const userDetailsResponse = await axiosInstance.post('/user/details', {
          name_user: cleanedUsername
        });
        // Enhanced type extraction and validation
        
        const type = userDetailsResponse.data.data.type_user;

        if (!userDetailsResponse.data.data) {
          setUsernameError('Nombre de usuario no encontrado');
          return;
        }
        if (!type) {
          setUsernameError('Tipo de usuario no encontrado');
          console.error('User type not found for username:', cleanedUsername);
          return;
        }
        // Explicitly set user type in context before login
        console.log('Login: Tipo de usuario extraido de los detalles del usuario en la DB = ', type);
        
        setUserType(type);

        console.log( '-> UserType actualizado en el contexto de la App');
        // Proceed with login using the obtained user type
        
        const loginResponse = await axiosInstance.post('/user/login', {
          name_user: cleanedUsername,
          pass_user: password,
          type_user: type
        });

        console.log('-> handleLogin() - /user/login response = ', loginResponse);

        await handleLoginResponse(loginResponse);

      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        if (errorMessage.includes('username')) {
          setUsernameError('Nombre de usuario no encontrado');
        } else {
          setUsernameError('Nombre de usuario o contraseña incorrectos');
        }
      }
    };

  const handleRegistration = async (cleanedUsername, password, userType, userLocation) => {
      const registrationData = {
          name_user: cleanedUsername,
          pass_user: password,
          type_user: userType,
          location_user: userLocation
      };

      const response = await axiosInstance.post('/user/register', registrationData);
      
      console.log('-> LoginRegisterFunctions.jsx - handleRegistration() - /user/register response = ', response);

      await handleRegistrationResponse(response);

      toggleForm();
  };
    

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
        
          console.log('-> handleFormSubmit() - isLoggingIn:', isLoggingIn);
          // IP validation for registration only
          if (!isLoggingIn) {
            console.log('-> handleFormSubmit() - Validación de IP para registro');
            const canRegister = await validateIPRegistration();
            if (!canRegister) {
              console.log('Validación de IP fallida. No se permite el registro.');
              return;
            }
          }
      
          // Username validation
          const { isValid, cleanedUsername, errors } = validateUsername(username);

          if (!isValid) {
            console.log('Error en el nombre de usuario:', errors[0]);
            setError(errors[0]);
            return;
          }
      
          // Form validation
          if (isButtonDisabled()) {
            return;
          }
      
          // Check for existing session
          if (!isLoggingIn && currentUser?.id) {
            console.log('-> Ya existe un usuario registrado con ese nombre.');
            setUsernameError('Ya existe un usuario registrado con ese nombre.');
            return;
          }
      
          ///////// Handle login or registration /////////

          if (isLoggingIn) {
            console.log('-> Iniciando sesión', { cleanedUsername, userType });

            await handleLogin(cleanedUsername, password);
          
          } else {
            console.log('-> Registrando usuario', { cleanedUsername, userType });

            await handleRegistration(cleanedUsername, password, userType, userlocation);
            
          }
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message;
          if (errorMessage.includes('username')) {
            setUsernameError(errorMessage);
          } else {
            setPasswordError(errorMessage);
          } 
          
          // Reset password fields on error
          setPassword('');
          setPasswordRepeat('');
          setDisplayedPassword('');
          setShowPasswordLabel(true);
          setKeyboardKey((prev) => prev + 1);
        }
      };


    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
        if(e.target.value === 'seller') {
            setIsLoggingIn(false);
        } else {
            setIsLoggingIn(true);
        }
        // setUsernameError('');
    };


    const isButtonDisabled = () => {
        // Check if the username is valid
        const { isValid } = validateUsername(username);
        // If the username is not valid, disable the button
        if (!isValid) return true;
        // Check password fields based on whether we're logging in or registering
        if (isLoggingIn) {
        // For login, only require a 4-digit password
        return password.length !== 4;
        } else {
        // For registration, require a 4-digit password, matching password repeat, and a selected user type
        return password.length !== 4 || 
                passwordRepeat.length !== 4 || 
                password !== passwordRepeat || 
                !userType === '';
        }
    };

    return {
        handlePasswordComplete,
        handlePasswordChange,
        handleRepeatPasswordChange,
        isButtonDisabled,
        toggleForm,
        handleFormSubmit,
        handleUserTypeChange,
        handleUsernameChange,
        // validateForm,
        usernameError,
        passwordError,
        ipError,
        handleUserLocationChange
    };
};