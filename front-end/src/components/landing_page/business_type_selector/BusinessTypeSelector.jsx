import React from 'react';
import { ArrowLeft } from 'lucide-react';

const BusinessTypeButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full mb-2 p-4 text-lg bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-between"
    >
      <span>{children}</span>
      <span className="text-gray-400">→</span>
    </button>
  );
};

const BusinessTypeSelector = ({ onSelectBusiness, onBack }) => {
  const handleClick = (type) => {
    if (onSelectBusiness) {
      onSelectBusiness(type);
    }
  };

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
        <BusinessTypeButton onClick={() => handleClick("General")}>
          General
        </BusinessTypeButton>
        <BusinessTypeButton onClick={() => handleClick("Carnicería")}>
          Carnicería
        </BusinessTypeButton>
        <BusinessTypeButton onClick={() => handleClick("Frutería")}>
          Frutería / Verdulería
        </BusinessTypeButton>
        <BusinessTypeButton onClick={() => handleClick("Pescadería")}>
          Pescadería
        </BusinessTypeButton>
        <BusinessTypeButton onClick={() => handleClick("Restaurante")}>
          Restaurante / Bar
        </BusinessTypeButton>
      </div>
    
    </div>
  );
};

export default BusinessTypeSelector;