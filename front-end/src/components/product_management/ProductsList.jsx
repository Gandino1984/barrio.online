import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../app_context/AppContext.js';
import axiosInstance from '../../../utils/axiosConfig.js';
import styles from './ProductsList.module.css';
import ProductManagementFunctions from './ProductManagementFunctions.jsx';
import FiltersForProducts from './FiltersForProducts.jsx';

const ProductsList = () => {
  const { 
    products, setProducts,
    error, setError,
    selectedShop, setSelectedShop,
    loading, setLoading,
    filters, setFilters,
    filteredProducts, setFilteredProducts
  } = useContext(AppContext);

  useEffect(() => {
    // Reset filters when shop changes
    setFilters({
      temporada: null,
      tipo: null,
      oferta: null,
      calificacion: null,
    });
  }, [selectedShop, setFilters]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.post('/product/by-shop-id', { id_shop: selectedShop.id_shop });
        setProducts(response.data.data || []);
      } catch (err) {
        setError(err.message);
        setProducts([]); // Ensure products is an empty array on error
      } finally {
        setLoading(false);
      }
    };

    if (selectedShop) {
      fetchProducts();
    }
  }, [selectedShop, setLoading, setProducts, setError]);

  useEffect(() => {
    // Ensure products exists and is an array before filtering
    if (Array.isArray(products) && products.length > 0) {
      const { filterProducts } = ProductManagementFunctions();
      const filtered = filterProducts(products, filters);
      setFilteredProducts(filtered);
    } else {
      // If no products, set filtered products to an empty array
      setFilteredProducts([]);
    }
  }, [products, filters, setFilteredProducts]);

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Cargando productos...</div>;

  return (
    <div className={styles.container}>
      {selectedShop && (
        <div className={styles.shopInfo}>
          <h2 className="text-2xl font-bold text-center flex-1 pr-10">
            {selectedShop.name_shop}
          </h2>
          <p>Ubicación: {selectedShop.location_shop}</p>
          <p>Calificación: {selectedShop.calification_shop || 'No disponible'}/5</p>
        </div>
      )}
      
      <div className={styles.filterContainer}>
        <FiltersForProducts />
      </div>

      <h2 className="text-2xl font-bold text-center flex-1 pr-10">
        Productos de la tienda
      </h2>

      {filteredProducts.length === 0 ? (
        <p className="text-center">No hay productos disponibles</p>
      ) : (
        <div className={styles.list}>
          {filteredProducts.map((product) => (
            <div key={product.id_product} className={styles.product}>
              <h3 className={styles.productName}>{product.name_product}</h3>
              <p className={styles.productDescription}>{product.info_product}</p>
              <p className={styles.productPrice}>Precio: {product.price_product}</p>
              <p className={styles.productType}>Tipo: {product.type_product}</p>
              <p className={styles.productStock}>Stock: {product.stock_product}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;