import React from 'react';
import { useContext } from 'react';
import AppContext from '../../app_context/AppContext.js';
import styles from '../../../../public/css/FiltersForProducts.module.css';

const FiltersForProducts = () => {
  const { 
    filterOptions, 
    filters, 
    setFilters 
  } = useContext(AppContext);

  const handleFilterChange = (filterName, option) => {
    // Normalize the option to handle case sensitivity and exact matching
    const normalizedOption = option === "" ? null : 
      filterName === 'temporada' ? 
        (option === 'Todo el año' ? 'Todo el Año' : option) : 
        option;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: normalizedOption,
    }));
  };

  const handleOnSaleChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      oferta: e.target.checked ? 'Sí' : null
    }));
  };

  return (
    <div className={styles.container}>
      {Object.keys(filterOptions).map((filterName) => {
        // Special handling for the "oferta" (on sale) filter
        if (filterName === 'oferta') {
          return (
            <div key={filterName} className={styles.filterWrapper}>
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
          );
        }

        // Existing filter rendering for other filter types
        return (
          <div key={filterName} className={styles.filterWrapper}>
            <select
              value={filters[filterName] || ""}
              onChange={(e) => handleFilterChange(filterName, e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">
                Por {filterOptions[filterName].label}
              </option>
              {Array.isArray(filterOptions[filterName].options) && filterOptions[filterName].options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
};

export default FiltersForProducts;