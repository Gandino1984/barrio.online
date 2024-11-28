import React, { useContext } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import AppContext from '../../../app_context/AppContext.js';
import axiosInstance from '../../../../utils/axiosConfig.js';

const ShopsList = ({ onBack, onAddShop, onSelectShop }) => {
  const { 
    currentUser, 
    shops, 
    setShops, 
    error, 
    setError 
  } = useContext(AppContext);

  const handleDeleteShop = async (shopId) => {
    console.log("handleDeleteShop - shopId:", shopId);
    try {
      const response = await axiosInstance.post('/shop/remove', { id_shop: shopId });
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
  
      setShops(prevShops => prevShops.filter(shop => shop.id_shop !== shopId));
    } catch (err) {
      setError(err.message || 'Error eliminando tienda');
      console.error('Shop deletion error:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-center flex-1 pr-10">
          Mis Negocios
        </h2>
        <button 
          onClick={onAddShop}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Agregar
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {shops.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No tienes negocios registrados. ¡Agrega uno para comenzar!
        </div>
      ) : (
        <div className="space-y-4">
          {shops.map((shop) => (
            <div 
              key={shop.id_shop} 
              className="p-4 border rounded flex justify-between items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectShop(shop)}
            >
              <div>
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

export default ShopsList;