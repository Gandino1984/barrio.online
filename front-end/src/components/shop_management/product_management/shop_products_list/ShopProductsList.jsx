import React, { useEffect, useContext, useState } from 'react';
import AppContext from '../../../../app_context/AppContext';
import ShopProductListFunctions from './ShopProductsListFunctions.jsx';
import FiltersForProducts from '../../../filters_for_products/FiltersForProducts.jsx';
import { PackagePlus, Pencil, Trash2, CheckCircle, ImagePlus } from 'lucide-react';
import styles from './ShopProductsList.module.css';
import ProductCreationFormFunctions from '../product_creation_form/ProductCreationFormFunctions.jsx';
import ConfirmationModal from '../../../confirmation_modal/ConfirmationModal.jsx';

const ShopProductList = () => {
  const {
    currentUser,
    products,
    selectedShop,
    filters,
    filteredProducts, setFilteredProducts,
    setShowProductManagement,
    selectedProducts, setSelectedProducts,
    setSelectedProductToUpdate,
    setIsUpdatingProduct,
    setNewProductData,
    setModalMessage,
    setIsModalOpen,
    isAccepted,
    setIsAccepted,
    isDeclined,
    setIsDeclined,
    clearError
  } = useContext(AppContext);

  const [productToDelete, setProductToDelete] = useState(null);
  const { resetNewProductData } = ProductCreationFormFunctions();
  const { filterProducts, fetchProductsByShop, deleteProduct } = ShopProductListFunctions();

  // Fetch products when shop changes
  useEffect(() => {
    if (selectedShop?.id_shop) {
      // Initial fetch
      fetchProductsByShop();
    }
  }, [selectedShop]);

  // Filter products when products or filters change
  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const filtered = filterProducts(products, filters);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [products, filters]);

  // Handle deletion confirmation
  useEffect(() => {
    const handleConfirmedDelete = async () => {
      if (isAccepted && productToDelete) {
        console.log('Deleting product:', productToDelete);
        try {
          const result = await deleteProduct(productToDelete);
          console.log('Delete result:', result);
          if (result.success) {
            await fetchProductsByShop();
          }
        } catch (error) {
          console.error('Error deleting product:', error);
        } finally {
          // Reset all states
          setProductToDelete(null);
          setIsAccepted(false);
          clearError();
        }
      }
    };

    handleConfirmedDelete();
  }, [isAccepted, productToDelete]);

  // Handle deletion cancellation
  useEffect(() => {
    if (isDeclined) {
      setProductToDelete(null);
      setIsDeclined(false);
      clearError();
    }
  }, [isDeclined]);

  const handleDeleteProduct = async (productId) => {
    console.log('Attempting to delete product:', productId);
    setProductToDelete(productId);
    setModalMessage('¿Estás seguro que deseas eliminar este producto?');
    setIsModalOpen(true);
    setIsAccepted(false);
    setIsDeclined(false);
  };

  const handleAddProduct = () => {
    setShowProductManagement(true);
  };

  const handleUpdateProduct = (productId) => {
    const productToUpdate = products.find(p => p.id_product === productId);
    if (productToUpdate) {
      resetNewProductData();
      setSelectedProductToUpdate(productToUpdate);
      setIsUpdatingProduct(true);
      setShowProductManagement(true);
    }
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

  const handleUploadProductImage = (productId) => {
    // TODO: Implement image upload functionality
    console.log('Uploading image for product:', productId);
  };

  return (
    <div className={styles.container}>
      <ConfirmationModal />
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
          Productos mostrados: {filteredProducts.length} 
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
                      type="button"
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