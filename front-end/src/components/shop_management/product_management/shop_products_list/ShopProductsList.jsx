import React, { useEffect, useContext, useState } from 'react';
import AppContext from '../../../../app_context/AppContext.js';
import ShopProductListFunctions from './ShopProductsListFunctions.jsx';
import FiltersForProducts from '../../../filters_for_products/FiltersForProducts.jsx';
import { PackagePlus, Pencil, Trash2, CheckCircle, ImagePlus } from 'lucide-react';
import styles from '../../../../../../public/css/ShopProductsList.module.css';
import ProductCreationFormFunctions from '../product_creation_form/ProductCreationFormFunctions.jsx';
import ConfirmationModal from '../../../confirmation_modal/ConfirmationModal.jsx';
import { ProductImageFunctions } from '../product_image/ProductImageFunctions.jsx';
import ProductImage from '../product_image/ProductImage.jsx';

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
    clearError,
    setUploading,
    setError,
    setProducts
  } = useContext(AppContext);

  const [productToDelete, setProductToDelete] = useState(null);

  const { resetNewProductData } = ProductCreationFormFunctions();
  
  const { filterProducts, fetchProductsByShop, deleteProduct, bulkDeleteProducts, confirmBulkDelete } = ShopProductListFunctions();

  const { handleProductImageUpload, getProductImageUrl } = ProductImageFunctions();
  
  const handleImageUpload = async (file, product_id) => {
    try {
      const imageUrl = await handleProductImageUpload(
        file, 
        product_id,
        setError,
        setUploading
      );
      
      if (imageUrl) {
        // Update the products list with the new image
        const updatedProducts = products.map(product => 
          product.product_id === product_id 
            ? { ...product, image_product: imageUrl }
            : product
        );
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.error('Error uploading product image:', error);
    }
  };

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
    if (isAccepted) {
      if (productToDelete) {
        // Single product deletion
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
          setProductToDelete(null);
          setIsAccepted(false);
          clearError();
        }
      } else {
        // Bulk deletion
        await bulkDeleteProducts();
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

  const handleDeleteProduct = async (product_id) => {
    console.log('Attempting to delete product:', product_id);
    setProductToDelete(product_id);
    setModalMessage('¿Estás seguro que deseas eliminar este producto?');
    setIsModalOpen(true);
    setIsAccepted(false);
    setIsDeclined(false);
  };

  const handleBulkDelete = () => {
    confirmBulkDelete();
  };

  const handleAddProduct = () => {
    setShowProductManagement(true);
  };

  const handleUpdateProduct = (product_id) => {
    const productToUpdate = products.find(p => p.product_id === product_id);
    if (productToUpdate) {
      resetNewProductData();
      setSelectedProductToUpdate(productToUpdate);
      setIsUpdatingProduct(true);
      setShowProductManagement(true);
    }
  };

  const handleSelectProduct = (product_id) => {
    setSelectedProducts(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(product_id)) {
        newSelected.delete(product_id);
      } else {
        newSelected.add(product_id);
      }
      return newSelected;
    });
  };

  const handleUploadProductImage = (product_id) => {
    // TODO: Implement image upload functionality
    console.log('Uploading image for product:', product_id);
  };

  return (
    <div className={styles.container}>
      <ConfirmationModal />
      {selectedShop && (
        <div className={styles.shopInfo}>
          <div className={styles.shopInfoHeader}>
            <h2 className={styles.shopName}>{selectedShop.shop_name}</h2>
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
              // onClick={handleBulkUpdate}
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
                <th className={styles.tableHeaderCell}>Image</th>
                <th className={styles.tableHeaderCell}>Nombre</th>
                <th className={styles.tableHeaderCell}>Precio</th>
                <th className={styles.tableHeaderCell}>Stock</th>
                <th className={styles.tableHeaderCell}>Descuento</th>
                <th className={styles.tableHeaderCell}>Temporada</th>
                <th className={styles.tableHeaderCell}>Tipo</th>
                <th className={styles.tableHeaderCell}>Subtipo</th>
                <th className={styles.tableHeaderCell}>Más Información</th>
                <th className={styles.tableHeaderCell}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr 
                  key={product.product_id}
                  className={`${styles.tableRow} ${selectedProducts.has(product.product_id) ? styles.selected : ''}`}
                >
                  <td className={styles.tableCell}>
                  <ProductImage product_id={product.product_id} />
                  </td>
                  <td className={styles.tableCell}>{product.name_product}</td>
                  <td className={styles.tableCell}>${product.price_product}</td>
                  <td className={styles.tableCell}>{product.stock_product}</td>
                  <td className={styles.tableCell}>
                    {product.discount_product > 0 ? `${product.discount_product}%` : '-'}
                  </td>
                  <td className={styles.tableCell}>{product.season_product}</td>
                  <td className={styles.tableCell}>{product.type_product}</td>
                  <td className={styles.tableCell}>{product.subtype_product}</td>
                  <td className={styles.tableCell}>{product.info_product}</td>
                  <td className={styles.actionsCell}>
                    <button 
                      onClick={() => handleUpdateProduct(product.product_id)}
                      className={`${styles.actionButton} ${styles.updateButton}`}
                      title="Actualizar producto"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.product_id)}
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      title="Eliminar producto"
                      type="button"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleSelectProduct(product.product_id)}
                      className={`${styles.actionButton} ${styles.selectButton} ${
                        selectedProducts.has(product.product_id) ? styles.selected : ''
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