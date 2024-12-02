import { useState} from 'react';
import axiosInstance from '../../../../../utils/axiosConfig.js';
import { useContext } from 'react';
import AppContext from '../../../../app_context/AppContext.js';

/**
 * Custom hook to handle IP validation for registration.
 * 
 * @returns {object} An object containing the IP error state and a function to validate IP registration.
 */
export const useIPValidation = () => {
  const {
    ipError, setIpError
  } = useContext(AppContext);

  /**
   * Validate IP registration by checking if the client's IP has exceeded the registration limit.
   * 
   * @returns {boolean} True if registration is allowed, false otherwise.
   */
  const validateIPRegistration = async () => {
    try {
      // Send a GET request to the '/user/ip/check' endpoint to check the registration limit
      const response = await axiosInstance.get('/user/ip/check');

      // If the response indicates that registration is not allowed
      if (!response.data.canRegister) {
        // Calculate the number of hours until the registration limit resets
        const hoursLeft = Math.ceil(response.data.hoursUntilReset);

        // Set the IP error message
        setIpError(`Demasiados registros desde esta IP. Intente nuevamente en ${hoursLeft} horas.`);
        return false;
      }

      // If registration is allowed, clear the IP error message
      setIpError('');
      return true;
    } catch (error) {
      // If an error occurs during the validation process, set a generic error message
      setIpError('Error en el proceso de validación de registro.');
      return false;
    }
  };

  // Return the IP error state and the validateIPRegistration function
  return {
    ipError,
    setIpError,
    validateIPRegistration
  };
};