import React, { useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import AppContext from '../../../app_context/AppContext.js';
import styles from './ShopCreationForm.module.css';
import { ShopCreationFormFunctions } from './ShopCreationFormFunctions.jsx'

const ShopCreationForm = () => {


  const { 
    newShop, 
    setNewShop
  } = useContext(AppContext);

  const {
    handleAddShop
  } = ShopCreationFormFunctions();

  console.log('-> ShopCreationForm.jsx - newShop = ', newShop);

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
            <div className={styles.formField}>
                <select
                  value={newShop.type_shop}
                  onChange={(e) => setNewShop({...newShop, type_shop: e.target.value})}
                  className={styles.input} 
                  required
                >
                    <option value="" disabled >Categoría</option>
                    <option value="Artesania">Artesanía</option>
                    <option value="Bienestar">Bienestar</option>
                    <option value="Consultoria">Consultoría</option>
                    <option value="Comida">Comida</option>
                    <option value="Educativo">Educativo</option>
                    <option value="Especializado">Especializado</option>
                    <option value="Ropa">Ropa</option>   
                    <option value="Servicios">Servicios</option>
                    <option value="Taller">Taller</option> 
                    <option value="Varios">Varios</option>
                </select>
            </div>
            <div className={styles.formField}>
                <select
                  value={newShop.subtype_shop}
                  onChange={(e) => setNewShop({...newShop, subtype_shop: e.target.value})}
                  className={styles.input} 
                  required
                >
                    <option  value="" disabled>Subcategoría</option>
                    <option value="Accesorios">Accesorios</option>
                    <option value="Bar">Bar</option>
                    <option value="Carniceria">Carnicería</option>
                    <option value="China">China</option>
                    <option value="Complementos">Complementos</option>
                    <option value="Digital">Digital</option>
                    <option value="Drogueria">Droguería</option>
                    <option value="Especial">Especial</option>
                    <option value="Ferreteria">Ferretería</option>
                    <option value="Fisioterapia">Fisioterapia</option>
                    <option value="Fruteria">Frutería</option>
                    <option value="General">General</option>
                    <option value="Italiana">Italiana</option>
                    <option value="Japonesa">Japonesa</option>
                    <option value="Kebab">Kebab</option>
                    <option value="Mascotas">Mascotas</option>
                    <option value="Mecanico">Mecánico</option>
                    <option value="Merceria">Mercería</option>
                    <option value="Panaderia">Panadería</option>
                    <option value="Pescaderia">Pescadería</option>
                    <option value="Peluqueria">Peluquería</option>
                    <option value="Peruana">Peruana</option>
                    <option value="Restaurante">Restaurante</option>
                    <option value="Turca">Turca</option>
                    <option value="Zapateria">Zapatería</option>
                </select>
            </div>
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