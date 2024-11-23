import { useContext, useState } from 'react';
import AppContext from '../../../../app_context/AppContext.js';
import { useUsernameValidation } from './useUsernameValidation.jsx';
import axiosInstance from '../../../../../utils/axiosConfig.js';

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
        const cleanedValue = cleanupUsername(rawValue);
        setUsername(cleanedValue);
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
                setPassword('');
                setPasswordRepeat('');
                setDisplayedPassword('');
                setShowPasswordRepeat(false);
                setShowPasswordLabel(true);
                setKeyboardKey((prev) => prev + 1);
            } else {
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

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setPasswordRepeat('');
        setDisplayedPassword('');
        setShowPasswordRepeat(false);
        setShowPasswordLabel(true);
        setKeyboardKey((prev) => prev + 1);
        setUsernameError('');
        // Also clear the user type when resetting
        setUserType('');
    };

    const toggleForm = () => {
        // Clear any existing user session when switching forms
        clearUserSession();
        setIsLoggingIn((prevState) => !prevState);
        resetForm();
    };

    const handleLoginResponse = async (response) => {
        if (!response.data) {
            throw new Error('No se recibió respuesta del servidor');
        }
        if (response.data.error) {
            throw new Error(response.data.error);
        }
        const userData = response.data.data;
        if (!userData || !userData.id_user || !userData.name_user || !userData.type_user) {
            throw new Error('Datos de usuario incompletos o inválidos');
        }
        // Standardize user data structure
        const normalizedUserData = {
            username: userData.name_user,
            password: password,
            userType: userData.type_user,
            id: userData.id_user
        };
        login(normalizedUserData);
        setShowBusinessSelector(true);
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
        // Standardize user data structure
        const normalizedUserData = {
            username: userData.name_user,
            password: password,
            userType: userType,
            id: userData.id_user
        };

        login(normalizedUserData);
        setShowBusinessSelector(true);
    };

    const validateForm = (cleanedUsername) => {
        // Basic input validation
        if (!cleanedUsername || cleanedUsername.trim() === '') {
            return { isValid: false, error: 'El nombre de usuario es requerido' };
        }
        if (!password || password.length !== 4) {
            return { isValid: false, error: 'La contraseña debe tener 4 dígitos' };
        }
        if (!isLoggingIn) {
            if (!passwordRepeat || passwordRepeat.length !== 4) {
                return { isValid: false, error: 'La confirmación de contraseña debe tener 4 dígitos' };
            }

            if (password !== passwordRepeat) {
                return { isValid: false, error: 'Las contraseñas no coinciden' };
            }

            if (!userType) {
                return { isValid: false, error: 'Debe seleccionar un tipo de usuario' };
            }
        }
        return { isValid: true, error: null };
    };

    const handleLogin = async (cleanedUsername, password) => {
        const response = await axiosInstance.post('/user/login', {
        name_user: cleanedUsername,
        pass_user: password
        });
        await handleLoginResponse(response);
    };
  
    const handleRegistration = async (cleanedUsername, password, userType) => {
        const registrationData = {
            name_user: cleanedUsername,
            pass_user: password,
            type_user: userType,
            location_user: 'bilbao'
        };
        console.log('Sending registration request with data:', registrationData);
        const response = await axiosInstance.post('/user/register', registrationData);
        console.log('Registration response:', response); 
        await handleRegistrationResponse(response);
        toggleForm();
    };

    //function to clear the current user session
    const clearUserSession = () => {
        logout();
        setUsername('');
        setPassword('');
        setPasswordRepeat('');
        setDisplayedPassword('');
        setShowPasswordLabel(true);
        setKeyboardKey((prev) => prev + 1);
        setShowBusinessSelector(false);
    };
      
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submission started with mode:", isLoggingIn ? 'login' : 'registration');
        try {
            // Username validation
            const { isValid, cleanedUsername, errors } = validateUsername(username);
            console.log("Username validation results:", { isValid, cleanedUsername, errors });
            if (!isValid) {
                setUsernameError(errors[0]);
                return;
            }
            // Form validation
            const formValidation = validateForm(cleanedUsername);
            console.log("Form validation results:", formValidation);
            if (!formValidation.isValid) {
                setUsernameError(formValidation.error);
                return;
            }
            // Modified check - only block if we're actually logged in AND trying to access protected resources
            if (!isLoggingIn && currentUser?.id) {
                console.log("Active session detected:", currentUser);
                setUsernameError('Ya existe un usuario registrado. Cierre sesión primero.');
                return;
            }
            console.log('Proceeding with authentication. Current state:', {
                isLoggingIn,
                currentUser,
                cleanedUsername,
                userType
            });
            if (isLoggingIn) {
                await handleLogin(cleanedUsername, password);
            } else {
                await handleRegistration(cleanedUsername, password, userType);
            }
        } catch (error) {
            console.error(`Process failed:`, {
                mode: isLoggingIn ? 'login' : 'registration',
                error: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            const errorMessage = error.response?.data?.error || error.message || `Error en el ${isLoggingIn ? 'inicio de sesión' : 'registro'}. Por favor intente nuevamente.`;
            setUsernameError(errorMessage);  
            // Reset password fields on error
            setPassword('');
            setPasswordRepeat('');
            setDisplayedPassword('');
            setShowPasswordLabel(true);
            setKeyboardKey((prev) => prev + 1);
        }
    };
    
    const handleBusinessSelect = async (businessType) => {
        try {
            // Implement business type selection logic here
            console.log('Selected business:', businessType);
            // You might want to save this to the user's profile
            // await axiosInstance.post('/user/update-business', { 
            //     userId: currentUser.id, 
            //     businessType 
            // });
        } catch (error) {
            console.error('Error setting business type:', error);
            setUsernameError('Error al seleccionar el tipo de negocio');
        }
    };

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
        setUsernameError('');
    };

    const isButtonDisabled = () => {
        const { isValid } = validateUsername(username);
        console.log("Button disable check:", { 
            usernameValid: isValid,
            passwordLength: password.length,
            passwordRepeatLength: passwordRepeat?.length,
            passwordsMatch: password === passwordRepeat,
            userType
        });
        
        if (!isValid) return true;
    
        if (isLoggingIn) {
            return password.length !== 4;
        } else {
            return password.length !== 4 || 
                   passwordRepeat.length !== 4 || 
                   password !== passwordRepeat || 
                   !userType;
        }
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