import { useState} from 'react';
import axiosInstance from '../../../../../utils/axiosConfig.js';
import { useContext } from 'react';
import AppContext from '../../../../app_context/AppContext.js';


export const useIPValidation = () => {
<<<<<<< HEAD
=======

>>>>>>> dev
  const {
    ipError, setIpError
  } = useContext(AppContext);


  const validateIPRegistration = async () => {
    try {
      const response = await axiosInstance.get('/user/ip/check');
      console.log('Response:', response.data);
      // If the response indicates that registration is not allowed
      if (!response.data.canRegister) {
        // Calculate the number of hours until the registration limit resets
        const hoursLeft = Math.ceil(response.data.hoursUntilReset);

        // Set the IP error message
        setIpError(`Demasiados registros en este dispositivo. Intente en ${hoursLeft} horas.`);
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
    validateIPRegistration
  };
};