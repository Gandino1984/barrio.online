import React, { useState, useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import AppContext from '../../../app_context/AppContext.js';
import axiosInstance from '../../../../utils/axiosConfig.js';
import styles from './ShopCreationForm.module.css';
import { ShopCreationFormFunctions } from './ShopCreationFormFunctions.jsx'

const ShopCreationForm = ({ onShopCreated, onCancel }) => {


  const {
    handleAddShop
  } = ShopCreationFormFunctions();

  handleAddShop(newShop);

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
          <input
            type="text"
            placeholder='Nombre del Negocio'
            value={newShop.name_shop}
            onChange={(e) => setNewShop({...newShop, name_shop: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder='Dirección'
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