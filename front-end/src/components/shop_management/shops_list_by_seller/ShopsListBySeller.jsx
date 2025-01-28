import React, { useContext, useEffect } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import styles from './ShopsListBySeller.module.css';
import { ShopsListBySellerFunctions } from './ShopsListBySellerFunctions.jsx';
import { Plus, Eraser, PackagePlus, Box } from 'lucide-react';
import ConfirmationModal from '../../confirmation_modal/ConfirmationModal.jsx';

const ShopsListBySeller = () => {
  const { 
    shops, 
    selectedShop, 
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

    useEffect(() => {
      console.log('Shops state updated:', shops);
    }, [shops]);

  return (
    <div className={styles.container}>
        <ConfirmationModal />
    <div className={styles.content}>
          <div className={styles.headerContainer}>
                <div className={styles.header}>
                      <p className={styles.title}>
                          Mis comercios
                      </p>
                    
                    <button 
                        onClick={handleAddShop}
                        className={styles.addButton}
                    >
                        Crear Nuevo
                        <Box size={16} />
                    </button>
                </div>
          </div>

          {shops.length === 0 ? (
            <div className={styles.messageNoShops}>
                No tienes comercios registrados. ¡Agrega uno para comenzar!
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
                        <h4 className={styles.shopName}>{shop.name_shop}</h4>
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
                            Eliminar
                            <Eraser size={16} />
                        </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
    </div>
  );
};

export default ShopsListBySeller;