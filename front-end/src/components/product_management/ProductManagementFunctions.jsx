import React from 'react';

const ProductManagementFunctions = () => {

const filterProducts = (products, filters) => {
  if (!products || !filters) return products;

  return products.filter((product) => {
    const seasonMatch = filters.temporada === null || product.season_product === filters.temporada;
    const typeMatch = filters.tipo === null || product.type_product === filters.tipo;
    const onSaleMatch = filters.oferta === null || (filters.oferta === 'Sí' && product.discount_product > 0);
    const calificationMatch = filters.calificacion === null || 
      product.calification_product >= parseInt(filters.calificacion);

    return seasonMatch && typeMatch && onSaleMatch && calificationMatch;
  });
};

  return { filterProducts };
};

export default ProductManagementFunctions;