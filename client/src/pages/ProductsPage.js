import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/api';
import './ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let data;
        if (selectedCategory) {
          data = await productService.getProductsByCategory(selectedCategory);
        } else {
          data = await productService.getAllProducts();
        }
        setProducts(data);

        // Extract unique categories if we have all products
        if (!selectedCategory) {
          const uniqueCategories = [...new Set(data.map(p => p.category))];
          setCategories(uniqueCategories);
        }

      } catch (err) {
        setError('Error loading products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">Browse Products</h1>

        <div className="category-filters">
          <button
            className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('')}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="loading">
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.length === 0 ? (
              <div className="no-products">
                <p>No products found.</p>
              </div>
            ) : (
              products.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage; 