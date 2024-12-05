/**
 * ShopsByType component.
 * Displays a list of shops by type and allows the user to select a shop.
 * 
 * @param {Object} props - The component props.
 * @param {Function} props.onBack - The callback function to navigate back.
 * 
 * @returns {JSX.Element} The ShopsByType component.
 */
import React, { useEffect, useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import AppContext from '../../../app_context/AppContext.js';
import styles from './ShopsByType.module.css';
import ProductsList from '../../product_management/ProductsList.jsx'; 
import { ShopsByTypeFunctions } from './hooks/ShopsByTypeFunctions.jsx';

const ShopsByType = ({ onBack }) => {
  /**
   * Destructure the business type, shops, loading, error, selected shop, and setSelectedShop from the AppContext.
   * These values are used to display the shops by type and handle shop selection.
   */
  const { 
    businessType, 
    shops,
    loading,
    error,
    selectedShop, setSelectedShop,
  } = useContext(AppContext);

  /**
   * Destructure the fetchShopsByType function from the ShopsByTypeFunctions hook.
   * This function is used to fetch the shops by type when the component mounts or the business type changes.
   */
  const { fetchShopsByType } = ShopsByTypeFunctions();

  /**
   * Effect hook to fetch the shops by type when the component mounts or the business type changes.
   * Resets the selected shop to null when the business type changes.
   */
  useEffect(() => {
    console.log('!!! Business type:', businessType);
    setSelectedShop(null);
    fetchShopsByType();
  }, [businessType]);

  /**
   * Handle shop selection by setting the selected shop in the AppContext.
   * 
   * @param {Object} shop - The selected shop.
   */
  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
  };

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
        /**
         * Display the ProductsList component if a shop is selected.
         */
        <ProductsList />
      ) : (
        <div>
          {shops.length === 0 ? (
            /**
             * Display a message if no shops are available for the selected type.
             */
            <p>No hay {businessType} shops disponibles.</p>
          ) : (
            /**
             * Display a list of shops by type.
             */
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