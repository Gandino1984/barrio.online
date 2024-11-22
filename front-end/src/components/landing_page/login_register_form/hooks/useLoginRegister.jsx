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
    };

    const toggleForm = () => {
        setIsLoggingIn((prevState) => !prevState);
        resetForm();
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

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Username validation
            const { isValid, cleanedUsername, errors } = validateUsername(username);
            if (!isValid) {
                setUsernameError(errors[0]);
                return;
            }

            // Form validation
            const formValidation = validateForm(cleanedUsername);
            if (!formValidation.isValid) {
                setUsernameError(formValidation.error);
                return;
            }

            // Check if user is already logged in for registration
            if (!isLoggingIn && currentUser) {
                setUsernameError('Ya existe un usuario registrado. Cierre sesión primero.');
                return;
            }

            if (isLoggingIn) {
                // Login flow
                const response = await axiosInstance.post('/user/login', {
                    name_user: cleanedUsername,
                    pass_user: password
                });
                await handleLoginResponse(response);
            } else {
                // Registration flow
                const registrationData = {
                    name_user: cleanedUsername,
                    pass_user: password,
                    type_user: userType,
                    location_user: 'default'
                };

                const response = await axiosInstance.post('/user/register', registrationData);
                await handleRegistrationResponse(response);
            }
        } catch (error) {
            console.error(`${isLoggingIn ? 'Login' : 'Registration'} error:`, error);
            
            // Standardize error handling
            const errorMessage = error.response?.data?.error || 
                               error.message || 
                               `Error en el ${isLoggingIn ? 'inicio de sesión' : 'registro'}. Por favor intente nuevamente.`;
            
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