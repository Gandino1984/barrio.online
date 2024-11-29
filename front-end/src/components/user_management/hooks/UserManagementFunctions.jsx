import { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';

export const UserManagementFunctions = () => {
  const {
    setSelectedBusinessType,
    setBusinessType
  } = useContext(AppContext);
  
  const handleClick = (type) => {
    setBusinessType(type);
  };

  const handleBusinessTypeSelect = (type) => {
    // Set the business type in context
    setBusinessType(type);
    // Set the selected business type to trigger rendering of specific shops
    setSelectedBusinessType(type);
  };


  return {
    handleClick,
    handleBusinessTypeSelect
  };
};