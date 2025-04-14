import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { productService } from '../services/api';
import { SearchContext } from '../App';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { searchResults } = useContext(SearchContext);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [navigationOrigin, setNavigationOrigin] = useState(null);

  useEffect(() => {
    // Capture navigation origin from state if available
    if (location.state?.from) {
      setNavigationOrigin(location.state.from);
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Error loading product details. Please try again later.');
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, location]);

  // Format the price with 2 decimal places and correct currency symbol
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const handleBackToResults = () => {
    navigate('/', { 
      state: { 
        returnedFromProduct: true,
        productId: id 
      } 
    });
  };

  const handleBackToProducts = () => {
    navigate('/products', {
      state: {
        returnedFromProduct: true,
        productId: id
      }
    });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <Link to="/products" className="back-link">Back to Products</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found-container">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="back-link">Back to Products</Link>
      </div>
    );
  }

  // Check if this product was in the search results
  const wasInSearchResults = searchResults && 
    searchResults.recommendations && 
    searchResults.recommendations.some(rec => rec.product && rec.product._id === id);

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/products">Products</Link> / {product.name}
        </div>

        <div className="product-detail">
          <div className="product-detail-image">
            <img src={product.imageUrl} alt={product.name} />
          </div>
          <div className="product-detail-info">
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-category">{product.category}</p>
            <p className="product-detail-price">{formatPrice(product.price)}</p>
            <div className="product-detail-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
            
            {product.attributes && product.attributes.size > 0 && (
              <div className="product-detail-attributes">
                <h3>Specifications</h3>
                <ul>
                  {Array.from(product.attributes).map(([key, value]) => (
                    <li key={key}>
                      <span className="attribute-name">{key}:</span> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="product-detail-actions">
              {wasInSearchResults && (
                <button 
                  onClick={handleBackToResults} 
                  className="btn-back btn-search-results"
                >
                  Back to Search Results
                </button>
              )}
              {navigationOrigin === 'products' ? (
                <button 
                  onClick={handleBackToProducts}
                  className="btn-back"
                >
                  Back to Products
                </button>
              ) : (
                <Link to="/products" className="btn-back">Products</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 