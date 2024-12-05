import React from 'react';
import { useContext } from 'react';
import AppContext from '../../app_context/AppContext.js';
import styles from './FiltersForProducts.module.css';

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

  return (
    <div className={styles.container}>
      {Object.keys(filterOptions).map((filterName) => (
        <div key={filterName} className={styles.filterWrapper}>
          <select
            value={filters[filterName] || ""}
            onChange={(e) => handleFilterChange(filterName, e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">
              Mostrar por {filterOptions[filterName].label}
            </option>
            {filterOptions[filterName].options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default FiltersForProducts;