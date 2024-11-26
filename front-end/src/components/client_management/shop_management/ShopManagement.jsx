import React, { useContext, useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import AppContext from '../../app_context/AppContext.js';
import styles from './ShopManagement.module.css';
import axiosInstance from '../../../utils/axiosConfig.js';

const ShopManagement = ({ onBack }) => {
  const { 
    currentUser, 
    shops, 
    setShops, 
    loading, 
    setLoading, 
    error, 
    setError,
    selectedShop,
    setSelectedShop
  } = useContext(AppContext);

  const [isAddingShop, setIsAddingShop] = useState(false);
  const [newShop, setNewShop] = useState({
    name_shop: '',
    location_shop: '',
    type_shop: '',
    id_user: null
  });

  useEffect(() => {
    const fetchUserShops = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        // Modify this endpoint to match your backend
        const response = await axiosInstance.post(`/shop`);
        setShops(response.data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching shops');
        setLoading(false);
      }
    };

    fetchUserShops();
  }, [currentUser]);

  const handleAddShop = async (e) => {
    e.preventDefault();
    try {
      const shopData = {
        ...newShop,
        id_user: currentUser.id,
        calification_shop: 0  // Default value from model
      };

      // Note: Backend seems to use GET for creation
      const response = await axiosInstance.post('/shop/create', { 
        params: shopData 
      });
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      // Update shops list
      setShops(prevShops => [...prevShops, response.data.data]);
      
      // Reset form
      setNewShop({
        name_shop: '',
        location_shop: '',
        type_shop: '',
        id_user: null
      });
      setIsAddingShop(false);
    } catch (err) {
      setError(err.message || 'Error adding shop');
    }
  };

  const handleDeleteShop = async (shopId) => {
    try {
      // Note: Backend uses GET for removal
      const response = await axiosInstance.post(`/shop/${shopId}/remove`);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }

    //   const response = await axiosInstance.post('/shop/type', {
    //     type_shop: businessType
    //   }, {
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   });

      setShops(prevShops => prevShops.filter(shop => shop.id_shop !== shopId));
    } catch (err) {
      setError(err.message || 'Error deleting shop');
    }
  };

  const handleSelectShop = (shop) => {
    setSelectedShop(shop);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (isAddingShop) {
    return (
      <div className={styles.container}>
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setIsAddingShop(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-center flex-1 pr-10">
            Agregar Negocio
          </h2>
        </div>

        <form onSubmit={handleAddShop} className="space-y-4">
          <div className="form-group">
            <label className="block mb-2">Nombre del Negocio</label>
            <input
              type="text"
              value={newShop.name_shop}
              onChange={(e) => setNewShop({...newShop, name_shop: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="form-group">
            <label className="block mb-2">Dirección</label>
            <input
              type="text"
              value={newShop.location_shop}
              onChange={(e) => setNewShop({...newShop, location_shop: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="form-group">
            <label className="block mb-2">Tipo de Negocio</label>
            <select
              value={newShop.type_shop}
              onChange={(e) => setNewShop({...newShop, type_shop: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecciona un tipo</option>
              <option value="General">General</option>
              <option value="Carniceria">Carnicería</option>
              <option value="Fruteria">Frutería / Verdulería</option>
              <option value="Pescaderia">Pescadería</option>
              <option value="Restaurante">Restaurante / Bar</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Guardar Negocio
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-center flex-1 pr-10">
          Mis Negocios
        </h2>
        <button 
          onClick={() => setIsAddingShop(true)}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Agregar
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
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
              onClick={() => handleSelectShop(shop)}
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

export default ShopManagement;