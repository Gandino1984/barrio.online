import { useContext } from 'react';
import LoginRegisterContext from '../context/LoginRegisterContext';

export const useLoginRegister = () => {
  const context = useContext(LoginRegisterContext);
  
  if (!context) {
    throw new Error('useLoginRegister debe ser usado dentro de un LoginRegisterProvider');
  }
  
  return context;
};