import React, { useEffect, useContext, useState } from 'react';
import AppContext from '../../../../app_context/AppContext';
import ShopProductListFunctions from './ShopProductsListFunctions.jsx';
import FiltersForProducts from '../../../client_management/client_product_management/filters_for_client_products/FiltersForProducts.jsx';
import { PackagePlus, Pencil, Trash2, CheckCircle, ImagePlus } from 'lucide-react';
import styles from './ShopProductsList.module.css';
import ProductCreationFormFunctions from '../product_creation_form/ProductCreationFormFunctions.jsx';

const ShopProductList = () => {
  const {
    currentUser,
    products,
    selectedShop,
    filters, setFilters,
    filteredProducts, setFilteredProducts,
    setShowProductManagement,
    selectedProducts, setSelectedProducts,
    setSelectedProductToUpdate,
    setIsUpdatingProduct 
  } = useContext(AppContext);

  const { resetNewProductData } = ProductCreationFormFunctions();

  const { filterProducts, fetchProductsByShop } = ShopProductListFunctions();
  
  const [filteredProductsCount, setFilteredProductsCount] = useState(0);

  useEffect(() => {
    let intervalId;
    
    if (selectedShop?.id_shop) {
      // Initial fetch
      fetchProductsByShop();
      
      // Set up polling every 30 seconds
      intervalId = setInterval(() => {
        fetchProductsByShop();
      }, 30000);
    }

    // Cleanup interval on unmount or shop change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selectedShop]); 

  
  useEffect(() => {
    // Reset product-related state on login/logout
    if (!currentUser) {
      setNewProductData({
        name_product: '',
        price_product: '',
        discount_product: 0,
        season_product: '',
        calification_product: 0,
        type_product: '',
        stock_product: 0,
        info_product: '',
        id_shop: ''
      });
      setSelectedProductToUpdate(null);
      setIsUpdatingProduct(false);
      setShowProductManagement(false);
    }
  }, [currentUser]);

  useEffect(() => {
    setFilters({
      temporada: '',
      tipo: '',
      oferta: '',
      calificacion: 0,
    });

    if (selectedShop?.id_shop) {
      console.log("-> Buscando productos de la tienda = ", selectedShop.name_shop);
      fetchProductsByShop();
    } else {
      console.error("-> No hay tienda seleccionada para buscar productos");
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
    const productToUpdate = products.find(p => p.id_product === productId);
    if (productToUpdate) {
      console.log('Setting up product for update:', productToUpdate);
      // Reset form first
      resetNewProductData();
      // Then set the product and update mode
      setSelectedProductToUpdate(productToUpdate);
      setIsUpdatingProduct(true);
      setShowProductManagement(true);
    }
  };

  const handleDeleteProduct = (productId) => {
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

  const handleBulkDelete = () => {
    // TODO: Implement bulk delete functionality
    console.log('Deleting products:', Array.from(selectedProducts));
  };

  const handleBulkUpdate = () => {
    // TODO: Implement bulk update functionality
    console.log('Updating products:', Array.from(selectedProducts));
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
          <div className={styles.buttonGroup}>
            <button 
              onClick={handleAddProduct}
              className={styles.actionButton}
            >
              <PackagePlus size={17}/>
              <span className={styles.buttonText}>Añadir Producto</span>
            </button>
            
            <button 
              onClick={handleBulkDelete}
              className={`${styles.actionButton} ${styles.deleteButton}`}
              disabled={selectedProducts.size === 0}
            >
              <Trash2 size={17}/>
              <span className={styles.buttonText}>Borrar Productos</span>
            </button>

            <button 
              onClick={handleBulkUpdate}
              className={`${styles.actionButton} ${styles.updateButton}`}
              disabled={selectedProducts.size === 0}
            >
              <Pencil size={17}/>
              <span className={styles.buttonText}>Actualizar Productos</span>
            </button>
          </div>
        </div>
        <p className={styles.productsCount}>
          Productos mostrados: {filteredProductsCount} 
          {selectedProducts.size > 0 && ` | Seleccionados: ${selectedProducts.size}`}
        </p>
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
                className={`${styles.tableRow} ${selectedProducts.has(product.id_product) ? styles.selected : ''}`}
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
                    <button 
                      onClick={() => handleUploadProductImage(product.id_product)}
                      className={`${styles.actionButton}`}
                      title="Subir imagen de producto"
                    >
                      <ImagePlus size={18} />
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