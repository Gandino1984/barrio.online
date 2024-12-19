import React, { useContext, useEffect } from 'react';
import AppContext from '../../app_context/AppContext.js';
import BusinessTypeButton from './BusinessTypeButton.jsx';
import ShopsByType from '../shop_management/shops_by_type/ShopsByType.jsx'; 
import styles from './UserManagement.module.css';
import { UserManagementFunctions } from './hooks/UserManagementFunctions.jsx';

const UserManagement = () => {
  const { 
    selectedShopType, setSelectedShopType, shopTypes 
  } = useContext(AppContext);

  const { handleBusinessTypeSelect, fetchShopTypes } = UserManagementFunctions();

  // Fetch shop types when component mounts
  useEffect(() => {
    fetchShopTypes();
  }, []);

  // If a business type is selected, render the ShopsByType component for that type
  if (selectedShopType) {
    return <ShopsByType onBack={() => setSelectedShopType(null)} />;
  }

  return (
    <div className={styles.container}>
        <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-center flex-1 pr-10">
                Selecciona el tipo de negocio
            </h2>
        </div>
        <div className="space-y-3">
            {shopTypes.map((shopType) => (
                <BusinessTypeButton 
                    key={shopType} 
                    onClick={() => handleBusinessTypeSelect(shopType)}
                >
                    {shopType}
                </BusinessTypeButton>
            ))}
        </div>
    </div>
  );
};

export default UserManagement;