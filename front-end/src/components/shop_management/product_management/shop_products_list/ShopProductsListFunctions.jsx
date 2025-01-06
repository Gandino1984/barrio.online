import { useContext } from 'react';
import axiosInstance from '../../../../../utils/axiosConfig';
import AppContext from '../../../../app_context/AppContext';

const ShopProductsListFunctions = () => {
  const { 
    setProducts, 
    setError,
    selectedShop, 
    setFilteredProducts,
    filters
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
        console.warn('No shop selected');
        setProducts([]);
        return;
      }
      const response = await axiosInstance.get(`/product/by-shop-id/${selectedShop.id_shop}`);
      const fetchedProducts = response.data.data || [];
      console.log(`Fetched ${fetchedProducts.length} products for shop ${selectedShop.name_shop}`);
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } 
  };

  return {
    filterProducts,
    fetchProductsByShop
  };
};

export default ShopProductsListFunctions;