import React, { useContext, useEffect } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import styles from './ShopsListBySeller.module.css';
import { ShopsListBySellerFunctions } from './ShopsListBySellerFunctions.jsx';
import { Plus, Eraser } from 'lucide-react';


const ShopsListBySeller = () => {
  const { 
    shops, setShops, 
    currentUser
  } = useContext(AppContext);

    const { 
      handleSelectShop,
      handleDeleteShop,
      handleAddShop
    } = ShopsListBySellerFunctions();


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
          <div className="text-center text-gray-500 mt-10">
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
                      <h3 className="text-lg font-semibold">{shop.name_shop}</h3>
                      <p className="text-gray-600">{shop.location_shop}</p>
                      <p className="text-sm text-gray-500">{shop.type_shop}</p>
                      <p className="text-xs text-gray-400">
                        Calificación: {shop.calification_shop}/5
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