import React, { useContext, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import AppContext from '../../../app_context/AppContext.js';
import styles from './ShopCreationForm.module.css';
import { ShopCreationFormFunctions } from './ShopCreationFormFunctions.jsx'

const ShopCreationForm = () => {
  const { 
    newShop, 
    setNewShop,
    shopTypesAndSubtypes
  } = useContext(AppContext);

  const {
    handleAddShop
  } = ShopCreationFormFunctions();

  // Get the list of shop types
  const shopTypes = Object.keys(shopTypesAndSubtypes);

  // Get subtypes based on selected shop type
  const subtypes = newShop.type_shop 
    ? shopTypesAndSubtypes[newShop.type_shop] 
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
        > 
          <ArrowLeft size={20} />
        </button>
        <h2 className={styles.headerTitle}>
          Crear un negocio
        </h2>
      </div>
      <form onSubmit={handleAddShop} className={styles.form}>
        <div className={styles.formField}>
          <input
            type="text"
            placeholder='El nombre de tu negocio:'
            value={newShop.name_shop}
            onChange={(e) => setNewShop({...newShop, name_shop: e.target.value})}
            className={styles.input}
            required
          />
        </div>
        
        {/* Shop Type Dropdown */}
        <div className={styles.formField}>
          <select
            value={newShop.type_shop}
            onChange={(e) => {
              // Reset subtype when type changes
              setNewShop({
                ...newShop, 
                type_shop: e.target.value,
                subtype_shop: '' // Clear subtype
              })
            }}
            className={styles.input} 
            required
          >
            <option value="" disabled>Categoría</option>
            {shopTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Subtype Dropdown - Only show if a type is selected */}
        {newShop.type_shop && (
          <div className={styles.formField}>
            <select
              value={newShop.subtype_shop}
              onChange={(e) => setNewShop({...newShop, subtype_shop: e.target.value})}
              className={styles.input} 
              required
            >
              <option value="" disabled>Subcategoría</option>
              {subtypes.map(subtype => (
                <option key={subtype} value={subtype}>{subtype}</option>
              ))}
            </select>
          </div>
        )}
        
        <div className={styles.formField}>
          <input
            type="text"
            placeholder='La dirección de tu negocio:'
            value={newShop.location_shop}
            onChange={(e) => setNewShop({...newShop, location_shop: e.target.value})}
            className={styles.input}
            required
          />
        </div>
        <button 
          type="submit" 
          className={styles.saveButton}
        >
          CREAR
        </button>
      </form>
    </div>
  );
};

export default ShopCreationForm;