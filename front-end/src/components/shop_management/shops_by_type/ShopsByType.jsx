import React, { useEffect, useContext } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import axiosInstance from '../../../../utils/axiosConfig.js';
import AppContext from '../../../app_context/AppContext.js';
import styles from './ShopsByType.module.css';

const ShopsByType = ({ onBack }) => {
  const { 
    businessType, 
    shops, setShops,
    loading, setLoading,
    error, setError,
    setSelectedShop 
  } = useContext(AppContext);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axiosInstance.post('/shop/type', {
          type_shop: businessType
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        setShops(response.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error('FULL ERROR:', err);
        setError(err.message || `Error al cargar ${businessType} shops`);
        setLoading(false);
      }
    };
    
    fetchShops();
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
            <h2 className="text-2xl font-bold text-center flex-1 pr-10">
                {businessType} Shops
            </h2>
        </div>
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
  );
};

export default ShopsByType;