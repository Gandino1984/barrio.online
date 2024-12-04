import React, { useEffect, useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import axiosInstance from '../../../../utils/axiosConfig.js';
import AppContext from '../../../app_context/AppContext.js';
import styles from './ShopsByType.module.css';
import ProductsList from '../../product_management/ProductsList.jsx'; 
import { ShopsByTypeFunctions } from './hooks/ShopsByTypeFunctions.jsx';


const ShopsByType = ({ onBack }) => {
  const { 
    businessType, 
    shops, setShops,
    loading, setLoading,
    error, setError,
    selectedShop, setSelectedShop,
  } = useContext(AppContext);


  const { fetchShopsByType } = ShopsByTypeFunctions();

  useEffect(() => {
    console.log('!!! Business type:', businessType);
    setSelectedShop(null);
    fetchShopsByType();
  }, [businessType]);

  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
  };
  
  if (loading) return <div>Cargando {businessType} shops...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
                <ArrowLeft size={16} />
            </button>
        </div>
        {selectedShop ? (
          <ProductsList />
        ) : (
          <div>
              {shops.length === 0 ? (
                <p>No hay {businessType} shops disponibles.</p>
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