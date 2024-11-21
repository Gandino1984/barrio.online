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
      // First trim spaces from both ends
      let cleanedUsername = username.trim();
      // Replace multiple consecutive spaces with a single space
      cleanedUsername = cleanedUsername.replace(/\s+/g, ' ');
      // Remove special characters, keeping only letters, numbers, spaces and Spanish characters
      // This includes: standard letters, numbers, spaces, á é í ó ú ü ñ (both lowercase and uppercase)
      cleanedUsername = cleanedUsername.replace(/[^a-zA-Z0-9\sáéíóúüñÁÉÍÓÚÜÑ]/g, '');
      return cleanedUsername;
  };

  const validateUsername = (username) => {
      const cleanedUsername = cleanupUsername(username);
      return {
          isValid: cleanedUsername.length >= 2 && cleanedUsername.length <= 100, // TODO: are these reasonable length limits??
          cleanedUsername,
          errors: getValidationErrors(cleanedUsername)
      };
  };


  return {
    validateUsername,
    cleanupUsername
  };
};