import axios from 'axios';

// Create axios instance with base URL for API requests
const api = axios.create({
  baseURL: '/api',  // Use relative URL to work with proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get a single product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products in category ${category}:`, error);
      throw error;
    }
  },
};

export const searchService = {
  // Search products with natural language query
  searchProducts: async (query) => {
    try {
      const response = await api.post('/search', { query });
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },
};

export default {
  productService,
  searchService,
}; 