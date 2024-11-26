import { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';

export const useClientManagement = () => {
  const {
    businessType,
    setBusinessType
  } = useContext(AppContext);
  
  const handleClick = (type) => {
    setBusinessType(type);
  };


  return {
    handleClick
  };
};