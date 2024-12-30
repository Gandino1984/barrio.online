import React, { useEffect, useContext, useState } from 'react';
import AppContext from '../../../../app_context/AppContext';
import ShopProductListFunctions from './ShopProductListFunctions';
import FiltersForProducts from '../filters_for_client_products/FiltersForProducts';

const ShopProductList = () => {
  const {
    products,
    error,
    selectedShop,
    filters,
    setFilters,
    filteredProducts,
    setFilteredProducts,
    filterOptions,
    setFilterOptions,
    setShowProductManagement
  } = useContext(AppContext);

  const { filterProducts, fetchProductsByShop, fetchProductTypes } = ShopProductListFunctions();

  const [filteredProductsCount, setFilteredProductsCount] = useState(0);

  useEffect(() => {
    // Reset filters when a new shop is selected
    setFilters({
      temporada: null,
      tipo: null,
      oferta: null,
      calificacion: null,
    });

    if (selectedShop?.id_shop) {
      console.log("Fetching products for shop:", selectedShop.name_shop);
      fetchProductsByShop();
    } else {
      console.warn("No shop selected or invalid shop ID");
      setFilteredProducts([]);
    }
  }, [selectedShop]);

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const filtered = filterProducts(products, filters);
      setFilteredProducts(filtered);
      setFilteredProductsCount(filtered.length);
    } else {
      setFilteredProducts([]);
      setFilteredProductsCount(0);
    }
  }, [products, filters]);

  useEffect(() => {
    const fetchTypes = async () => {
      const productTypes = await fetchProductTypes();
      setFilterOptions(prev => ({
        ...prev,
        tipo: {
          label: 'Tipo de producto',
          options: productTypes
        }
      }));
    };
    fetchTypes();
  }, []);

  const handleAddProduct = () => {
    setShowProductManagement(true);
  };

  return (
    <div>
      {selectedShop && (
        <div>
          <h2>{selectedShop.name_shop}</h2>
          <p>Ubicación: {selectedShop.location_shop}</p>
          <p>Calificación: {selectedShop.calification_shop || 'No disponible'}/5</p>
        </div>
      )}

      <div>
        <h2>Lista de Productos</h2>
        <button onClick={handleAddProduct}>
          Añadir Producto
        </button>
        <p>Productos mostrados: {filteredProductsCount}</p>
      </div>

      <FiltersForProducts />

      {filteredProducts.length === 0 ? (
        <p>No hay productos disponibles</p>
      ) : (
        <div>
          {filteredProducts.map((product) => (
            <div key={product.id_product}>
              <h3>{product.name_product}</h3>
              <p>{product.info_product}</p>
              <p>Precio: ${product.price_product}</p>
              <p>Stock: {product.stock_product}</p>
              {product.discount_product > 0 && (
                <p>Descuento: {product.discount_product}%</p>
              )}
              <p>Temporada: {product.season_product}</p>
              <p>Tipo: {product.type_product}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopProductList;