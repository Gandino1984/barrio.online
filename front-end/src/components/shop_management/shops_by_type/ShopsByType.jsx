import React, { useEffect, useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import axiosInstance from '../../../../utils/axiosConfig.js';
import AppContext from '../../../app_context/AppContext.js';
import styles from './ShopsByType.module.css';
import ProductsList from '../../product_management/ProductsList.jsx'; 

const ShopsByType = ({ onBack }) => {
  console.log('!!! ShopsByType component rendered');

  const { 
    businessType, 
    shops, setShops,
    loading, setLoading,
    error, setError,
    selectedShop, setSelectedShop,
    products, setProducts  
  } = useContext(AppContext);

  console.log("!!! selectedShop value on ShopsByType render= ", selectedShop);


  useEffect(() => {
    setSelectedShop(null);
    const fetchShops = async () => {
      console.log('Fetching shops for business type:', businessType);
      try {
        setLoading(true);
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
      }finally {
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
          <div>
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
            {selectedShop && <ProductsList />} 
          </div>
        )}
    </div>
  );
};

export default ShopsByType;