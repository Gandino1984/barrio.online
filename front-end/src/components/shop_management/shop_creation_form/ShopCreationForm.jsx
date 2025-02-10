import React, { useContext, useEffect } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import styles from '../../../../../public/css/ShopCreationForm.module.css';
import { ShopCreationFormFunctions } from './ShopCreationFormFunctions.jsx';
import { Box, Clock } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';

const ShopCreationForm = () => {
  const { 
    newShop, 
    setNewShop,
    shopTypesAndSubtypes,
    selectedShop,
    setShowShopCreationForm
  } = useContext(AppContext);

  const {
    handleCreateShop,
    handleUpdateShop
  } = ShopCreationFormFunctions();

  // Animation configuration
  const formAnimation = useSpring({
    from: { 
      transform: 'translateY(35%)',
      opacity: 0
    },
    to: { 
      transform: 'translateY(0%)',
      opacity: 1
    },
    config: {
      mass: 1,
      tension: 280,
      friction: 22
    }
  });

  // Initialize form with selected shop data when updating
  useEffect(() => {
    if (selectedShop) {
      setNewShop({
        name_shop: selectedShop.name_shop,
        type_shop: selectedShop.type_shop,
        subtype_shop: selectedShop.subtype_shop,
        location_shop: selectedShop.location_shop,
        id_user: selectedShop.id_user,
        calification_shop: selectedShop.calification_shop,
        image_shop: selectedShop.image_shop,
        opening_time: selectedShop.opening_time || '09:00',
        closing_time: selectedShop.closing_time || '18:00',
        has_delivery: selectedShop.has_delivery || false
      });
    }
  }, [selectedShop, setNewShop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedShop) {
      await handleUpdateShop(selectedShop.id_shop, newShop);
    } else {
      await handleCreateShop(newShop);
    }
  };

  // Get the list of shop types
  const shopTypes = Object.keys(shopTypesAndSubtypes);

  // Get subtypes based on selected shop type
  const subtypes = newShop.type_shop ? shopTypesAndSubtypes[newShop.type_shop] : [];

  return (
    <animated.div style={formAnimation} className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>   
          <h3 className={styles.headerTitle}>
            {selectedShop ? 'Actualizar comercio' : 'Crear un comercio'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formField}>
            <input
              type="text"
              placeholder='Nombre del comercio:'
              value={newShop.name_shop || ''}
              onChange={(e) => setNewShop({...newShop, name_shop: e.target.value})}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formField}>
            <select
              value={newShop.type_shop || ''}
              onChange={(e) => {
                setNewShop({
                  ...newShop, 
                  type_shop: e.target.value,
                  subtype_shop: ''
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

          {newShop.type_shop && (
            <div className={styles.formField}>
              <select
                value={newShop.subtype_shop || ''}
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
              placeholder='Dirección del comercio:'
              value={newShop.location_shop || ''}
              onChange={(e) => setNewShop({...newShop, location_shop: e.target.value})}
              className={styles.input}
              required
            />
          </div>

          <div className={`${styles.formField} ${styles.timeGroup}`}>
            <div className={styles.timeInput}>
              <Clock size={16} className={styles.timeIcon} />
              <input
                type="time"
                value={newShop.opening_time || '09:00'}
                onChange={(e) => setNewShop({...newShop, opening_time: e.target.value})}
                className={styles.input}
                required
              />
            </div>
            <span className={styles.timeSeparator}>a</span>
            <div className={styles.timeInput}>
              <Clock size={16} className={styles.timeIcon} />
              <input
                type="time"
                value={newShop.closing_time || '18:00'}
                onChange={(e) => setNewShop({...newShop, closing_time: e.target.value})}
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={`${styles.formField} ${styles.checkboxField}`}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={newShop.has_delivery || false}
                onChange={(e) => setNewShop({...newShop, has_delivery: e.target.checked})}
                className={styles.checkbox}
              />
              <span>Ofrece servicio a domicilio</span>
            </label>
          </div>
          
          <div className={styles.buttonContainer}>
            <button 
              type="submit" 
              className={styles.submitButton}
            >
              {selectedShop ? 'Actualizar' : 'Crear'}
              <Box size={17} />
            </button>
          </div>
        </form>
      </div>
    </animated.div>
  );
};

export default ShopCreationForm;