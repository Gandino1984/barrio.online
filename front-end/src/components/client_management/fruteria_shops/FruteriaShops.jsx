import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../utils/axiosConfig.js';

const FruteriaShops = ({ onBack }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFruteriaShops = async () => {
      try {
        const response = await axiosInstance.get('/shop/type', {
          params: { type_shop: 'Fruteria' }
        });
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        setShops(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error al cargar fruterías');
        setLoading(false);
      }
    };
    fetchFruteriaShops();
  }, []);
  if (loading) return <div>Cargando fruterías...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-center flex-1 pr-10">
          Fruterías
        </h2>
      </div>
      {shops.length === 0 ? (
        <p>No hay fruterías disponibles.</p>
      ) : (
        <div className="space-y-3">
          {shops.map(shop => (
            <div 
              key={shop.id_shop} 
              className="bg-white border rounded-lg p-4 shadow-md"
            >
              <h3 className="text-xl font-semibold">{shop.name_shop}</h3>
              <p>Ubicación: {shop.location_shop}</p>
              <p>Calificación: {shop.calification_shop}/5</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FruteriaShops;