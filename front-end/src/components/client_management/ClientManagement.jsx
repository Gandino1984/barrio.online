import React, { useContext, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import AppContext from '../../app_context/AppContext.js';
import BusinessTypeButton from './BusinessTypeButton.jsx';
import ShopsByType from './shops_by_type/ShopsByType.jsx'; 

const ClientManagement = ({ onBack }) => {
  const [selectedBusinessType, setSelectedBusinessType] = useState(null);
  
  const { setBusinessType } = useContext(AppContext);

  const handleBusinessTypeSelect = (type) => {
    // Set the business type in context
    setBusinessType(type);
    // Set the selected business type to trigger rendering of specific shops
    setSelectedBusinessType(type);
  };
  
  // If a business type is selected, render the corresponding shops component
  if (selectedBusinessType === 'Fruteria') {
    return <ShopsByType onBack={() => setSelectedBusinessType(null)} />;
  }
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-center flex-1 pr-10">
          Selecciona el tipo de negocio
        </h2>
      </div>
      
      <div className="space-y-3">
        <BusinessTypeButton onClick={() => handleBusinessTypeSelect("General")}>
          General
        </BusinessTypeButton>
        <BusinessTypeButton onClick={() => handleBusinessTypeSelect("Carniceria")}>
          Carnicería
        </BusinessTypeButton>
        <BusinessTypeButton onClick={() => handleBusinessTypeSelect("Fruteria")}>
          Frutería / Verdulería
        </BusinessTypeButton>
        <BusinessTypeButton onClick={() => handleBusinessTypeSelect("Pescaderia")}>
          Pescadería
        </BusinessTypeButton>
        <BusinessTypeButton onClick={() => handleBusinessTypeSelect("Restaurante")}>
          Restaurante / Bar
        </BusinessTypeButton>
      </div>
    </div>
  );
};

export default ClientManagement;