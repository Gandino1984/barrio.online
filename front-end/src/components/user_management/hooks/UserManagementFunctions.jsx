import { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import axiosInstance from '../../../../utils/axiosConfig.js';

export const UserManagementFunctions = () => {
  const {
    setSelectedShopType,
    setShopType,
    setShopTypes,
    setLoading,
    setError,
    setShops
  } = useContext(AppContext);

  // Fetch shop types from the server
  const fetchShopTypes = async () => {
    try {
      const response = await axiosInstance.get('/shop/types-of-shops');
      if(response.data.error) {
        setError(prevError => ({ ...prevError, shopError: "Error al obtener los tipos de tiendas" }));
        throw new Error(response.data.error);
      }
      setShopTypes(response.data.data || []); // Adjust based on your actual response structure
    } catch (error) {
      console.error('-> UserManagementFunctions.jsx - fetchShopTypes() - Error = ', error);
      setShopTypes([]);
      setError('Error al obtener los tipos de negocio');
    }
  };

  // Handle business type selection
  const handleBusinessTypeSelect = async (type) => {
    setShopType(type);
    setSelectedShopType(type);
    setLoading(true);
    try {
      const response = await axiosInstance.post('/shop/type', { type_shop: type });

      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      setShops(response.data.data || []);
    } catch (error) {
      console.error('Error fetching shops by type:', error);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleBusinessTypeSelect,
    fetchShopTypes
  };
};