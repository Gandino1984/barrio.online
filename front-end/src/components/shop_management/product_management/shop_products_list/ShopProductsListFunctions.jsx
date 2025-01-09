import { useContext } from 'react';
import axiosInstance from '../../../../../utils/axiosConfig';
import AppContext from '../../../../app_context/AppContext';

const ShopProductsListFunctions = () => {
  const { 
    setProducts, 
    setError,
    selectedShop, 
    setFilteredProducts,
    filters,
    setShowErrorCard
  } = useContext(AppContext);

  const filterProducts = (products, filters) => {
    if (!products || !filters) return products;

    return products.filter((product) => {
      const seasonMatch = !filters.temporada || 
        product.season_product.toLowerCase() === filters.temporada.toLowerCase() ||
        product.season_product === 'Todo el Año';
      
      const typeMatch = !filters.tipo || 
        product.type_product === filters.tipo;
      
      const onSaleMatch = !filters.oferta || 
        (filters.oferta === 'Sí' && product.discount_product > 0) ||
        (filters.oferta === 'No' && product.discount_product === 0);
      
      const calificationMatch = !filters.calificacion || 
        product.calification_product >= parseInt(filters.calificacion);

      return seasonMatch && typeMatch && onSaleMatch && calificationMatch;
    });
  };

  const fetchProductsByShop = async () => {
    try {
      if (!selectedShop?.id_shop) {
        console.error('-> ShopProductsListFunctions.jsx - fetchProductsByShop - No hay comercio seleccionado');
        setError(prevError => ({ ...prevError, shopError: "No hay comercio seleccionado" }));
        setProducts([]);
        return;
      }
      const response = await axiosInstance.get(`/product/by-shop-id/${selectedShop.id_shop}`);

      const fetchedProducts = response.data.data || [];
      
      console.log(`Fetched ${fetchedProducts.length} products for shop ${selectedShop.name_shop}`);
      
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(prevError => ({ ...prevError, databaseResponseError: "Hubo un error al buscar los productos del comercio" }));
      setProducts([]);
    } 
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await axiosInstance.delete(`/product/remove-by-id/${productId}`);
      
      if (response.data.success) {
        return { success: true, message: response.data.success };
      } else {
        setError(prevError => ({ 
          ...prevError, 
          productError: response.data.error || "Error al eliminar el producto" 
        }));
        setShowErrorCard(true);
        return { success: false, message: response.data.error };
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(prevError => ({ 
        ...prevError, 
        productError: "Error al eliminar el producto" 
      }));
      setShowErrorCard(true);
      return { success: false, message: "Error al eliminar el producto" };
    }
  };

  return {
    filterProducts,
    fetchProductsByShop,
    deleteProduct
  };
};

export default ShopProductsListFunctions;