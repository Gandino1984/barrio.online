import React, { useContext } from 'react';
import ProductCreationFormFunctions from './ProductCreationFormFunctions';
import AppContext from '../../../../app_context/AppContext';
import styles from './ProductCreationForm.module.css';
import { CirclePlus, ScrollText, PackagePlus } from 'lucide-react';

const ProductCreationForm = () => {
  const {
    handleChange,
    handleNumericInputChange,
    resetNewProductData,
    handleSubmit
  } = ProductCreationFormFunctions();

  const { 
    newProductData: productData,
    filterOptions,
  } = useContext(AppContext);

  return (
    <div className={styles.container}>
        <div className={styles.formField}>
          <button type="submit" className={styles.submitButton}>
            Ver Lista de Productos
            <ScrollText size={20}/>
          </button>
        </div>

        <h3 className={styles.formTitle}>
          ¿O quieres crear un nuevo producto?
        </h3>
        
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formField}>
              <input
                type="text"
                id="name_product"
                name="name_product"
                placeholder='Nombre del Producto:'
                value={productData.name_product}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="price_product">Precio</label>
              <input
                type="number"
                id="price_product"
                name="price_product"
                value={productData.price_product}
                placeholder='0.00'
                onChange={handleNumericInputChange}
                step="0.1"
                min="0"
                required
              />
              <select
                id="type_product"
                name="type_product"
                value={productData.type_product}
                onChange={handleChange}
                required
              >
                <option value="">Tipo:</option>
                {filterOptions.tipo.options.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formField}>
              <select
                id="season_product"
                name="season_product"
                value={productData.season_product}
                onChange={handleChange}
              >
                {filterOptions.temporada.options.map(season => (
                  <option key={season} value={season}>
                    {season}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formField}>
              <label htmlFor="discount_product">Descuento (%)</label>
              <input
                type="number"
                id="discount_product"
                name="discount_product"
                value={productData.discount_product}
                onChange={handleNumericInputChange}
                step="1"
                min="0"
                max="100"
              />

              <label htmlFor="stock_product">Stock</label>
              <input
                type="number"
                id="stock_product"
                name="stock_product"
                value={productData.stock_product}
                onChange={handleNumericInputChange}
                min="0"
                required
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="info_product">Más información</label>
              <textarea
                id="info_product"
                name="info_product"
                value={productData.info_product}
                onChange={handleChange}
                rows="4"
                width="100%"
              />
            </div>

            <div className={styles.formField}>
              <button type="submit" className={styles.submitButton}>
                Crear Producto
                <PackagePlus size={16}/>
              </button>
            </div>
        </form>
    </div>
  );
};

export default ProductCreationForm;