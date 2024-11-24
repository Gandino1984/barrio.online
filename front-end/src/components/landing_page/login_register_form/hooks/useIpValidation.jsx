import { useState, useEffect } from 'react';
import axiosInstance from '../../../../../utils/axiosConfig.js';

export const useIPValidation = () => {
  const [ipError, setIpError] = useState('');
  
  const validateIPRegistration = async () => {
    try {
      // Get client IP and check registration limit
      const response = await axiosInstance.get('/user/ip/check');
      
      if (!response.data.canRegister) {
        const hoursLeft = Math.ceil(response.data.hoursUntilReset);
        setIpError(`Demasiados registros desde esta IP. Intente nuevamente en ${hoursLeft} horas.`);
        return false;
      }
      
      setIpError('');
      return true;
      
    } catch (error) {
      console.error('Error de validación de IP:', error);
      setIpError('Error al verificar límites de registro.');
      return false;
    }
  };

  return {
    ipError,
    setIpError,
    validateIPRegistration
  };
};