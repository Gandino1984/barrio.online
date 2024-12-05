import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../app_context/AppContext.js';
import styles from './ProductsList.module.css';
import ProductManagementFunctions from './ProductManagementFunctions.jsx';
import FiltersForProducts from './FiltersForProducts.jsx';

const ProductsList = () => {
  const { 
    products, 
    error,
    selectedShop, 
    loading,
    filters, 
    setFilters,
    filteredProducts, 
    setFilteredProducts
  } = useContext(AppContext);

  const { filterProducts, fetchProductsByShop } = ProductManagementFunctions();

  useEffect(() => {
    // Reset filters when a new shop is selected
    setFilters({
      temporada: null,
      tipo: null,
      oferta: null,
      calificacion: null,
    });

    // Ensure shop is selected before fetching products
    if (selectedShop && selectedShop.id_shop) {
      console.log("Fetching products for shop:", selectedShop.name_shop);
      fetchProductsByShop();
    } else {
      console.warn("No shop selected or invalid shop ID");
      setFilteredProducts([]);
    }
  }, [selectedShop]);

  useEffect(() => {
    // Filter products whenever products or filters change
    if (Array.isArray(products) && products.length > 0) {
      const filtered = filterProducts(products, filters);
      console.log("Filtered Products:", filtered);
      setFilteredProducts(filtered);
    } else {
      console.log("No products to filter");
      setFilteredProducts([]);
    }
  }, [products, filters, setFilteredProducts]);

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      {selectedShop && (
        <div className={styles.shopInfo}>
          <h2 className="text-2xl font-bold text-center flex-1 pr-10">
            {selectedShop.name_shop}
          </h2>
          <p>Ubicación: {selectedShop.location_shop}</p>
          <p>
            Calificación: {selectedShop.calification_shop || 'No disponible'}/5
          </p>
        </div>
      )}
      
      <div className={styles.filtersContainer}>
        <FiltersForProducts />
      </div>
      
      <h2 className="text-2xl font-bold text-center flex-1 pr-10">
        Productos de la tienda
      </h2>
      
      {filteredProducts.length === 0 ? (
        <p className="text-center">
          No hay productos disponibles
        </p>
      ) : (
        <div className={styles.list}>
          {filteredProducts.map((product) => (
            <div key={product.id_product} className={styles.product}>
              <h3 className={styles.productName}>
                {product.name_product}
              </h3>
              <p className={styles.productDescription}>
                {product.info_product}
              </p>
              <p className={styles.productPrice}>
                Precio: {product.price_product}
              </p>
              <p className={styles.productType}>
                Tipo: {product.type_product}
              </p>
              <p className={styles.productStock}>
                Stock: {product.stock_product}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;