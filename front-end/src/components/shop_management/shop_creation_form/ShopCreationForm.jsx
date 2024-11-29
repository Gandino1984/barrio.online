import React, { useState, useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import AppContext from '../../../app_context/AppContext.js';
import axiosInstance from '../../../../utils/axiosConfig.js';

const ShopCreationForm = ({ onShopCreated, onCancel }) => {
  const { currentUser, setShops, setError } = useContext(AppContext);

  const [newShop, setNewShop] = useState({
    name_shop: '',
    location_shop: '',
    type_shop: '',
    id_user: currentUser?.id || null
  });

  const handleAddShop = async (e) => {
    e.preventDefault();
    try {
      const shopData = {
        ...newShop,
        calification_shop: 0  // Default value
      };

      const response = await axiosInstance.post('/shop/create', shopData);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      // Update shops list and notify parent
      setShops(prevShops => [...prevShops, response.data.data]);
      onShopCreated(response.data.data);
    } catch (err) {
      setError(err.message || 'Error adding shop');
      console.error('Shop creation error:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-center flex-1 pr-10">
          Agregar Negocio
        </h2>
      </div>

      <form onSubmit={handleAddShop} className="space-y-4">
        <div>
          <label className="block mb-2">Nombre del Negocio</label>
          <input
            type="text"
            value={newShop.name_shop}
            onChange={(e) => setNewShop({...newShop, name_shop: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Dirección</label>
          <input
            type="text"
            value={newShop.location_shop}
            onChange={(e) => setNewShop({...newShop, location_shop: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
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
};

export default ShopCreationForm;