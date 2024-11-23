import { useState, useEffect } from 'react';
import axiosInstance from '../../../../../utils/axiosConfig.js';

export const useIPValidation = () => {
  const [ipError, setIpError] = useState('');
  
  const validateIPRegistration = async () => {
    try {
      // Get client IP and check registration limit
      const response = await axiosInstance.get('/ip/check');
      
      if (!response.data.canRegister) {
        const hoursLeft = Math.ceil(response.data.hoursUntilReset);
        setIpError(`Demasiados registros desde esta IP. Por favor, intente nuevamente en ${hoursLeft} horas.`);
        return false;
      }
      
      setIpError('');
      return true;
      
    } catch (error) {
      console.error('IP validation error:', error);
      setIpError('Error al verificar límites de registro. Por favor, intente nuevamente.');
      return false;
    }
  };

  return {
    ipError,
    setIpError,
    validateIPRegistration
  };
};