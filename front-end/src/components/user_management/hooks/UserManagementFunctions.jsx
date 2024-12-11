import { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import axiosInstance from '../../../../utils/axiosConfig.js';

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
    setBusinessType,
    setShopTypes
  } = useContext(AppContext);

  /**
   * fetchShopTypes function.
   * Fetches the types of shops from the database and updates the shopTypes state.
   */
  const fetchShopTypes = async () => {
    try {
      const response = await axiosInstance.get('/shop/types-of-shops');
      setShopTypes(response.data.data || []); // Adjust based on your actual response structure
    } catch (error) {
      console.error('Error fetching shop types:', error);
      setShopTypes([]); 
    }
  };
  
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
    handleBusinessTypeSelect,
    fetchShopTypes
  };
};