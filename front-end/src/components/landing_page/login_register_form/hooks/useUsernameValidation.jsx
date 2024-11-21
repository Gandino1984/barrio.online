import { useContext } from 'react';
import AppContext from '../../../../app_context/AppContext.js';

export const useUsernameValidation = () => {
  const { setUsername } = useContext(AppContext);
  const getValidationErrors = (username) => {
    const errors = [];
    if (username.length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }
    if (username.length > 100) {
      errors.push('El nombre no puede exceder 100 caracteres');
    }
    if (username.trim().length === 0) {
      errors.push('El nombre es requerido');
    }
    return errors;
  };

  const cleanupUsername = (username) => {
    if (!username) return '';
    // Trim spaces from both ends
    let cleanedUsername = username.trim();
    // Remove special characters, keeping: letters, numbers, spaces, and Spanish characters
    cleanedUsername = cleanedUsername.replace(/[^a-zA-Z0-9\sáéíóúüñÁÉÍÓÚÜÑ]/g, '');
    // Reduce multiple consecutive spaces to a single space
    cleanedUsername = cleanedUsername.replace(/\s+/g, ' ');
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