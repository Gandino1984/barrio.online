import React, { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import styles from './ShopsListBySeller.module.css';
import { ShopsListBySellerFunctions } from './ShopsListBySellerFunctions.jsx';


const ShopsListBySeller = ({ onBack }) => {
  const { 
    shops, 
    selectedShop, setSelectedShop,
  } = useContext(AppContext);

    const { 
      handleSelectShop,
      handleDeleteShop,
      handleAddShop
    } = ShopsListBySellerFunctions();

  return (
    <div className={styles.container}>
        <div className="flex items-center mb-6">
              <div className={styles.header}>
                  <h2 className="text-2xl font-bold text-center flex-1 pr-10">
                      Mis Negocios
                  </h2>
                  <button 
                      onClick={handleAddShop}
                      className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                      + Agregar
                  </button>
              </div>
        </div>

        {/* {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
          </div>
        )} */}

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
                  <div className="flex space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteShop(shop.id_shop);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
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