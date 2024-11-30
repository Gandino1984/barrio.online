import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../app_context/AppContext.js';
import axiosInstance from '../../../utils/axiosConfig.js';
import styles from './ProductsList.module.css';

const ProductsList = () => {
  const { 
    products, setProducts,
    error, setError,
    selectedShop, setSelectedShop,
    loading, setLoading
  } = useContext(AppContext);

  useEffect(() => {
    console.log('!!! ProductList component rendered with selectedShop:', selectedShop);
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.post('/product/by-shop-id', { id_shop: selectedShop.id_shop });
        setProducts(response.data.data);
      } catch (err) {
        setError(err.message);
      }
    };
    if (selectedShop) { // Only fetch products if selectedShop is not null or undefined
      console.log('Fetching products for shop:', selectedShop);
      fetchProducts();
    }
    setLoading(false);
  }, [selectedShop, setLoading, setProducts, setError]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h2 className="text-2xl font-bold text-center flex-1 pr-10">
        Productos de la tienda
      </h2>
      <div className={styles.list}>
        {products.map((product) => (
          <div key={product.id_product} className={styles.product}>
            <h3 className={styles.productName}>{product.name_product}</h3>
            <p className={styles.productDescription}>{product.description}</p>
            <p className={styles.productPrice}>Precio: {product.price_product}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;