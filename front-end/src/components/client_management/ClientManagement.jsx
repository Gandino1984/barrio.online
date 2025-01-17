import React, { useContext, useEffect } from 'react';
import AppContext from '../../app_context/AppContext.js';
import ShopTypeButton from './ShopTypeButton.jsx';
import ShopsByType from './shops_by_type/ShopsByType.jsx'; 
import styles from '../../../../public/css/ClientManagement.module.css';
import { ClientManagementFunctions } from './ClientManagementFunctions.jsx';

const ClientManagement = () => {
  const { 
    selectedShopType, shopTypes 
  } = useContext(AppContext);

  const { handleBusinessTypeSelect, fetchShopTypes } = ClientManagementFunctions();

  // Fetch shop types when component mounts
  useEffect(() => {
    fetchShopTypes();
  }, []);


  if (selectedShopType) {
    return <ShopsByType />;
  }

  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <h2 className={styles.title}>
                Selecciona el tipo de comercio
            </h2>
        </div>
        <div className={styles.buttonsContainer}>
            {shopTypes.map((shopType) => (
                <ShopTypeButton 
                    key={shopType} 
                    onClick={() => handleBusinessTypeSelect(shopType)}
                >
                    {shopType}
                </ShopTypeButton>
            ))}
        </div>
    </div>
  );
};

export default ClientManagement;