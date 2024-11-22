import { useContext } from 'react';
import AppContext from '../../../../app_context/AppContext.js';

export const useUsernameValidation = () => {
  const { setUsername } = useContext(AppContext);
  const getValidationErrors = (username) => {
    const errors = [];
    if (username.length < 3) {  // Changed from 2 to 3
        errors.push('El nombre debe tener al menos 3 caracteres');
    }
    if (username.length > 50) {  // Changed from 100 to 50
        errors.push('El nombre no puede exceder 50 caracteres');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('El nombre solo puede contener letras, números y guiones bajos');
    }
    if (username.trim().length === 0) {
        errors.push('El nombre es requerido');
    }
    return errors;
};

  const cleanupUsername = (username) => {
    if (!username) return '';
    // Only allow letters, numbers, and underscores
    let cleanedUsername = username.replace(/[^a-zA-Z0-9_]/g, '');
    return cleanedUsername;
};

  const validateUsername = (username) => {
    const cleanedUsername = cleanupUsername(username);
    return {
        isValid: cleanedUsername.length >= 2 && cleanedUsername.length <= 100,
        cleanedUsername,
        errors: getValidationErrors(cleanedUsername)
    };
};


  return {
    validateUsername,
    cleanupUsername
  };
};