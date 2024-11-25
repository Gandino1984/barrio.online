import React, { useEffect, useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import axiosInstance from '../../../../utils/axiosConfig.js';
import AppContext from '../../../app_context/AppContext.js';

const FruteriaShops = ({ onBack }) => {
  const { 
    businessType, 
    shops, setShops,
    loading, setLoading,
    error, setError
  } = useContext(AppContext);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axiosInstance.post('/shop/type', {
          type_shop: businessType
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        
        setShops(response.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error('FULL ERROR:', err);
        setError(err.message || `Error al cargar ${businessType} shops`);
        setLoading(false);
      }
    };
    
    fetchShops();
  }, [businessType]);

  if (loading) return <div>Cargando {businessType} shops...</div>;
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
          {businessType} Shops
        </h2>
      </div>
      {shops.length === 0 ? (
        <p>No hay {businessType} shops disponibles.</p>
      ) : (
        <div className="space-y-3">
          {shops.map(shop => (
            <div 
              key={shop.id_shop} 
              className="bg-white border rounded-lg p-4 shadow-md"
            >
              <h3 className="text-xl font-semibold">{shop.name_shop}</h3>
              <p>Ubicación: {shop.location_shop}</p>
              <p>Calificación: {shop.calification_shop || 'No disponible'}/5</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FruteriaShops;