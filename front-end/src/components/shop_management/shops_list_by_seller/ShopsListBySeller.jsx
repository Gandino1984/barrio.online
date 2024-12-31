import React, { useContext, useEffect } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import styles from './ShopsListBySeller.module.css';
import { ShopsListBySellerFunctions } from './ShopsListBySellerFunctions.jsx';
import { Plus, Eraser } from 'lucide-react';

const ShopsListBySeller = () => {
  const { 
    shops, setShops,
    setSelectedShop, selectedShop, 
    currentUser
  } = useContext(AppContext);

    const { 
      handleSelectShop,
      handleDeleteShop,
      handleAddShop
    } = ShopsListBySellerFunctions();

    useEffect(() => {
      console.log('-> ShopsListBySeller.jsx - currentUser = ', currentUser);
      console.log('-> ShopsListBySeller.jsx - selectedShop = ', selectedShop);
    }, [currentUser, selectedShop]);

  return (
    <div className={styles.container}>
        <div className={styles.headerContainer}>
              <div className={styles.header}>
                  <h2 className={styles.title}>
                      Mis Negocios
                  </h2>
                  <button 
                      onClick={handleAddShop}
                      className={styles.addButton}
                  >
                      <Plus size={24} />
                      Agregar
                  </button>
              </div>
        </div>

        {shops.length === 0 ? (
          <div className={styles.messageNoShops}>
              No tienes negocios registrados. ¡Agrega uno para comenzar!
          </div>
        ) : (
          <div className={styles.list}>
              {shops.map((shop) => (
                <div 
                  key={shop.id_shop} 
                  className={styles.shop}
                  onClick={() => handleSelectShop(shop)}
                >
                  <div className={styles.shopInfo}>
                      <h3 className={styles.shopName}>{shop.name_shop}</h3>
                      <p className={styles.shopLocation}>{shop.location_shop}</p>
                      <p className={styles.shopType}>{shop.type_shop}</p>
                      <p className={styles.shopCalification}>
                        Calificación: {shop.calification_shop}
                      </p>
                  </div>
                  <div className={styles.shopActions}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteShop(shop.id_shop);
                        }}
                        className={styles.deleteButton}
                      >
                          <Eraser size={24} />
                          Eliminar
                      </button>
                  </div>
                </div>
              ))}
          </div>
        )}
    </div>
  );
};

export default ShopsListBySeller;