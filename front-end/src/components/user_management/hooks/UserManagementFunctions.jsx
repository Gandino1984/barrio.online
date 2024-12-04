import { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';

/**
 * UserManagementFunctions component.
 * Provides functions for managing user-related business type selections.

 * @return {Object} An object containing two functions: handleClick and handleBusinessTypeSelect.
 */
export const UserManagementFunctions = () => {
  /**
   * Destructure setSelectedBusinessType and setBusinessType from AppContext.
   * These functions are used to update the business type in the application context.
   */
  const {
    setSelectedBusinessType,
    setBusinessType
  } = useContext(AppContext);
  
  /**
   * handleClick function.
   * Sets the business type in the application context.
   * @param {string} type - The business type to be set.
   */
  const handleClick = (type) => {
    setBusinessType(type);
  };

  /**
   * handleBusinessTypeSelect function.
   * Sets the business type in the application context and triggers rendering of specific shops.
   * @param {string} type - The business type to be set.
   */
  const handleBusinessTypeSelect = (type) => {
    setBusinessType(type);
    // Set the selected business type to trigger rendering of specific shops
    setSelectedBusinessType(type);
  };

  return {
    handleClick,
    handleBusinessTypeSelect
  };
};