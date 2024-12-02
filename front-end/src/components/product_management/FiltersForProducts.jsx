import React from 'react';
import { useContext } from 'react';
import AppContext from '../../app_context/AppContext.js';
import styles from './FiltersForProducts.module.css';

const FiltersForProducts = () => {
  const { 
    filterOptions, 
    filters, 
    setFilters } = useContext(AppContext);

    const handleFilterChange = (filterName, option) => {
        setFilters((prevFilters) => ({
          ...prevFilters,
          [filterName]: option === "" ? null : option,
        }));
      };

  return (
    <div className={styles.container}>
        {Object.keys(filterOptions).map((filterName) => (
        <div key={filterName}>
            {/* <h4>{filterOptions[filterName].label}</h4> */}
            <select
            value={filters[filterName]}
            onChange={(e) => handleFilterChange(filterName, e.target.value)}
            >
                <option value="">
                    Por {filterOptions[filterName].label}
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