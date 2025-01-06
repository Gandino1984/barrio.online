import React, { useEffect, useContext, useState } from 'react';
import AppContext from '../../../../app_context/AppContext';
import ShopProductListFunctions from './ShopProductsListFunctions.jsx';
import FiltersForProducts from '../../../client_management/client_product_management/filters_for_client_products/FiltersForProducts.jsx';
import { PackagePlus, Pencil, Trash2, CheckCircle } from 'lucide-react';
import styles from './ShopProductsList.module.css';

const ShopProductList = () => {
  const {
    products,
    selectedShop,
    filters,
    setFilters,
    filteredProducts,
    setFilteredProducts,
    setShowProductManagement
  } = useContext(AppContext);

  const { filterProducts, fetchProductsByShop} = ShopProductListFunctions();
  const [filteredProductsCount, setFilteredProductsCount] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState(new Set());

  // fetch products when component mounts or products change
  useEffect(() => {
    if (selectedShop?.id_shop) {
      fetchProductsByShop();
    }
  }, [selectedShop, products.length]);

  useEffect(() => {
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

  const handleAddProduct = () => {
    setShowProductManagement(true);
  };

  const handleUpdateProduct = (productId) => {
    // TODO: Implement update product functionality
    console.log('Update product:', productId);
  };

  const handleDeleteProduct = (productId) => {
    // TODO: Implement delete product functionality
    console.log('Delete product:', productId);
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      return newSelected;
    });
  };

  return (
    <div className={styles.container}>
      {selectedShop && (
        <div className={styles.shopInfo}>
          <div className={styles.shopInfoHeader}>
            <h2 className={styles.shopName}>{selectedShop.name_shop}</h2>
            <p>Calificación: {selectedShop.calification_shop || 'No disponible'}/5</p>
          </div>
          <p className={styles.shopLocation}>{selectedShop.location_shop}</p>
        </div>
      )}

      <div className={styles.listHeader}>
        <div className={styles.listHeaderTop}>
          <h2 className={styles.listTitle}>Lista de Productos</h2>
          <button 
            onClick={handleAddProduct}
            className={styles.addButton}
          >
            Añadir Producto
            <PackagePlus size={17}/>
          </button>
        </div>
        <p className={styles.productsCount}>Productos mostrados: {filteredProductsCount}</p>
      </div>

      <FiltersForProducts />

      {filteredProducts.length === 0 ? (
        <p className={styles.noProducts}>No hay productos disponibles</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th className={styles.tableHeaderCell}>Nombre</th>
                <th className={styles.tableHeaderCell}>Precio</th>
                <th className={styles.tableHeaderCell}>Stock</th>
                <th className={styles.tableHeaderCell}>Descuento</th>
                <th className={styles.tableHeaderCell}>Temporada</th>
                <th className={styles.tableHeaderCell}>Tipo</th>
                <th className={styles.tableHeaderCell}>Más Información</th>
                <th className={styles.tableHeaderCell}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr 
                  key={product.id_product}
                  className={styles.tableRow}
                >
                  <td className={styles.tableCell}>{product.name_product}</td>
                  <td className={styles.tableCell}>${product.price_product}</td>
                  <td className={styles.tableCell}>{product.stock_product}</td>
                  <td className={styles.tableCell}>
                    {product.discount_product > 0 ? `${product.discount_product}%` : '-'}
                  </td>
                  <td className={styles.tableCell}>{product.season_product}</td>
                  <td className={styles.tableCell}>{product.type_product}</td>
                  <td className={styles.tableCell}>{product.info_product}</td>
                  <td className={styles.actionsCell}>
                    <button 
                      onClick={() => handleUpdateProduct(product.id_product)}
                      className={`${styles.actionButton} ${styles.updateButton}`}
                      title="Actualizar producto"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id_product)}
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      title="Eliminar producto"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleSelectProduct(product.id_product)}
                      className={`${styles.actionButton} ${styles.selectButton} ${
                        selectedProducts.has(product.id_product) ? styles.selected : ''
                      }`}
                      title="Seleccionar producto"
                    >
                      <CheckCircle size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShopProductList;