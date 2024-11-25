import { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';

export const useClientManagement = () => {
  const {
    isLoggingIn,
    setIsLoggingIn,
    
  } = useContext(AppContext);

//   const handleExample = () => {
//   };

  

  return {
    // handleexample,
  };
};