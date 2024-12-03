import axiosInstance from '../../../../utils/axiosConfig.js';

const fetchShopTypes = async () => {
  try {
    const response = await axiosInstance.get('/shop/types');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching shop types:', error);
    return [];
  }
};

export { fetchShopTypes };