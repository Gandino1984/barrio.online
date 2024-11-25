import React,  { useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import AppContext from '../../app_context/AppContext.js';
import BusinessTypeButton from './BusinessTypeButton.jsx';
import styles from './ClientManagement.module.css';
import { useClientManagement } from './hooks/useClientManagement.jsx';

const ClientManagement = ({ onBack }) => {

   
  const {
    businessType, 
    setBusinessType
  } = useContext(AppContext);

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
        <BusinessTypeButton onClick={() => setBusinessType("General")}>
          General
        </BusinessTypeButton>
        <BusinessTypeButton onClick={() => setBusinessType("Carniceria")}>
          Carnicería
        </BusinessTypeButton>
        <BusinessTypeButton onClick={() => setBusinessType("Fruteria")}>
          Frutería / Verdulería
        </BusinessTypeButton>
        <BusinessTypeButton onClick={() => setBusinessType("Pescaderia")}>
          Pescadería
        </BusinessTypeButton>
        <BusinessTypeButton onClick={() => setBusinessType("Restaurante")}>
          Restaurante / Bar
        </BusinessTypeButton>
      </div>
    
    </div>
  );
};

export default ClientManagement;