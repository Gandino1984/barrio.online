import React, { useContext } from 'react';
import ProductCreationFormFunctions from './ProductCreationFormFunctions';
import AppContext from '../../../../app_context/AppContext';
import styles from './ProductCreationForm.module.css';

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
    selectedShop
  } = useContext(AppContext);

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Crear Nuevo Producto</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name_product">Nombre del Producto*</label>
          <input
            type="text"
            id="name_product"
            name="name_product"
            value={productData.name_product}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price_product">Precio*</label>
          <input
            type="number"
            id="price_product"
            name="price_product"
            value={productData.price_product}
            onChange={handleNumericInputChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="type_product">Tipo de Producto*</label>
          <select
            id="type_product"
            name="type_product"
            value={productData.type_product}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar tipo</option>
            {filterOptions.tipo.options.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="season_product">Temporada</label>
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

        <div className={styles.formGroup}>
          <label htmlFor="discount_product">Descuento (%)</label>
          <input
            type="number"
            id="discount_product"
            name="discount_product"
            value={productData.discount_product}
            onChange={handleNumericInputChange}
            min="0"
            max="100"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="stock_product">Stock*</label>
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

        <div className={styles.formGroup}>
          <label htmlFor="info_product">Información Adicional</label>
          <textarea
            id="info_product"
            name="info_product"
            value={productData.info_product}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton}>
            Crear Producto
          </button>
          <button 
            type="button" 
            onClick={resetNewProductData}
            className={styles.resetButton}
          >
            Limpiar Formulario
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreationForm;