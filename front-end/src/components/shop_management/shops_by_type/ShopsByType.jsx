
import React, { useEffect, useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import styles from './ShopsByType.module.css';
import ProductsList from '../../product_management/ProductsList.jsx'; 
import { ShopsByTypeFunctions } from './hooks/ShopsByTypeFunctions.jsx';


const ShopsByType = () => {

  const { 
    shopType, 
    shops,
    loading,
    error,
    selectedShop, setSelectedShop,
  } = useContext(AppContext);


  const { 
    handleShopSelect,
    handleBack, 
    fetchShopsByType 
  } = ShopsByTypeFunctions();

  useEffect(() => {
    console.log('-> ShopsByType.jsx - Tipo de negocio = ', shopType);
    setSelectedShop(null);
    fetchShopsByType();
  }, [shopType]);

 
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
        {selectedShop ? (
          <ProductsList />
        ) : (
          <div>
            {shops.length === 0 ? (
          
              <p>No hay {shopType} shops disponibles.</p>
          
          ) : (
              <div className={styles.list}>
                {shops.map(shop => (
                    <div 
                      key={shop.id_shop} 
                      className={styles.shop}
                      onClick={() => handleShopSelect(shop)}
                    >
                        <div className={styles.shopInfo}>
                            <h3 className={styles.registerName}>{shop.name_shop}</h3>
                            <p className={styles.registerLocation}>Ubicación: {shop.location_shop}</p>
                            <p className={styles.registerCalification}>Calificación: {shop.calification_shop || 'No disponible'}/5</p>
                        </div>
                    </div>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default ShopsByType;