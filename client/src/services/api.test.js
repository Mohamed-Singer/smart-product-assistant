import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { productService, searchService } from './api';

describe('API Services', () => {
  let mock;
  
  beforeAll(() => {
    // Create a new instance of axios-mock-adapter
    mock = new MockAdapter(axios);
  });
  
  afterEach(() => {
    // Reset the mock after each test
    mock.reset();
  });
  
  afterAll(() => {
    // Restore axios after all tests
    mock.restore();
  });
  
  describe('productService', () => {
    const mockProducts = [
      { _id: '1', name: 'Product 1', price: 99.99 },
      { _id: '2', name: 'Product 2', price: 199.99 }
    ];
    
    test('getAllProducts returns products data', async () => {
      mock.onGet('/api/products').reply(200, mockProducts);
      
      const result = await productService.getAllProducts();
      expect(result).toEqual(mockProducts);
    });
    
    test('getProductById returns a single product', async () => {
      const product = mockProducts[0];
      mock.onGet('/api/products/1').reply(200, product);
      
      const result = await productService.getProductById('1');
      expect(result).toEqual(product);
    });
    
    test('getProductsByCategory returns filtered products', async () => {
      const categoryProducts = [mockProducts[0]];
      mock.onGet('/api/products/category/electronics').reply(200, categoryProducts);
      
      const result = await productService.getProductsByCategory('electronics');
      expect(result).toEqual(categoryProducts);
    });
    
    test('handles errors when fetching products', async () => {
      mock.onGet('/api/products').reply(500);
      
      await expect(productService.getAllProducts()).rejects.toThrow();
    });
  });
  
  describe('searchService', () => {
    const mockSearchResults = {
      success: true,
      query: 'laptop',
      recommendations: [
        {
          productId: '1',
          relevanceScore: 0.95,
          explanation: 'This matches because...',
          product: { name: 'MacBook Air', price: 999.99 }
        }
      ]
    };
    
    test('searchProducts sends query and returns results', async () => {
      mock.onPost('/api/search', { query: 'laptop' }).reply(200, mockSearchResults);
      
      const result = await searchService.searchProducts('laptop');
      expect(result).toEqual(mockSearchResults);
    });
    
    test('handles errors when searching', async () => {
      mock.onPost('/api/search').reply(500);
      
      await expect(searchService.searchProducts('laptop')).rejects.toThrow();
    });
  });
}); 