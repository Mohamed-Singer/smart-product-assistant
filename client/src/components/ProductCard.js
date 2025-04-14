import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, explanation, relevanceScore }) => {
  // Get current location to determine origin
  const location = useLocation();
  
  // Determine if we're on the products page or home page
  const isOnProductsPage = location.pathname === '/products';
  
  // Format the price with 2 decimal places and correct currency symbol
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-price">{formatPrice(product.price)}</p>
        <p className="product-description">{product.description}</p>
        {explanation && (
          <div className="product-match">
            <h4>Why this matches your search:</h4>
            <p>{explanation}</p>
            {relevanceScore && (
              <div className="relevance-score">
                <div 
                  className="relevance-bar" 
                  style={{ width: `${relevanceScore * 100}%` }}
                ></div>
                <span>{(relevanceScore * 100).toFixed(0)}% match</span>
              </div>
            )}
          </div>
        )}
        <Link 
          to={`/products/${product._id}`} 
          className="view-details"
          state={{ from: isOnProductsPage ? 'products' : 'home' }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard; 