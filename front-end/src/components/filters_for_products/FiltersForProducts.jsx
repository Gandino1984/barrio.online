import React from 'react';
import { useContext } from 'react';
import AppContext from '../../app_context/AppContext.js';
import styles from '../../../../public/css/FiltersForProducts.module.css';

const FiltersForProducts = () => {
  const { 
    filterOptions, 
    filters, 
    setFilters,
    productTypesAndSubtypes, // Add this to access product types
  } = useContext(AppContext);

  // Handle main filter changes
  const handleFilterChange = (filterName, option) => {
    const normalizedOption = option === "" ? null : option;
    
    setFilters(prevFilters => {
      const newFilters = {
        ...prevFilters,
        [filterName]: normalizedOption,
      };

      // Reset subtype when type changes
      if (filterName === 'tipo') {
        newFilters.subtipo = null;
      }

      return newFilters;
    });
  };

  // Handle discount filter changes
  const handleOnSaleChange = (e) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      oferta: e.target.checked ? 'Sí' : null
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      temporada: null,
      tipo: null,
      subtipo: null,
      oferta: null,
      calificacion: null,
    });
  };

  // Get available subtypes based on selected type
  const getAvailableSubtypes = () => {
    if (!filters.tipo || !productTypesAndSubtypes[filters.tipo]) {
      return [];
    }
    return productTypesAndSubtypes[filters.tipo];
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterControls}>
        {/* Season Filter */}
        <div className={styles.filterWrapper}>
          <select
            value={filters.temporada || ""}
            onChange={(e) => handleFilterChange('temporada', e.target.value)}
            className={`${styles.filterSelect} ${filters.temporada ? styles.hasValue : ''}`}
          >
            <option value="">Temporada</option>
            {filterOptions.temporada.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className={styles.filterWrapper}>
          <select
            value={filters.tipo || ""}
            onChange={(e) => handleFilterChange('tipo', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Tipo de producto</option>
            {Object.keys(productTypesAndSubtypes).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Subtype Filter - Only shown when type is selected */}
        {filters.tipo && (
          <div className={styles.filterWrapper}>
            <select
              value={filters.subtipo || ""}
              onChange={(e) => handleFilterChange('subtipo', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Subtipo</option>
              {getAvailableSubtypes().map((subtype) => (
                <option key={subtype} value={subtype}>
                  {subtype}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Rating Filter */}
        <div className={styles.filterWrapper}>
          <select
            value={filters.calificacion || ""}
            onChange={(e) => handleFilterChange('calificacion', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Calificación</option>
            {filterOptions.calificacion.options.map((option) => (
              <option key={option} value={option}>
                {option} ⭐ o más
              </option>
            ))}
          </select>
        </div>

        {/* Discount Checkbox */}
        <div className={styles.filterWrapper}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.oferta === 'Sí'}
              onChange={handleOnSaleChange}
              className={styles.checkbox}
            />
            En oferta
          </label>
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={handleResetFilters}
          className={styles.resetButton}
          type="button"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default FiltersForProducts;