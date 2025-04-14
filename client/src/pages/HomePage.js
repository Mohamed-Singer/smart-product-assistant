import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { searchService } from '../services/api';
import { SearchContext } from '../App';
import './HomePage.css';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

const HomePage = () => {
  const { searchResults, setSearchResults } = useContext(SearchContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // If returning from product detail page, searchResults will already be in context
    // No need to reset it when component mounts
    if (location.state?.returnedFromProduct) {
      // Clear the state after we've processed it to avoid issues on refresh
      window.history.replaceState({}, document.title);
      setSearchPerformed(true);
    }
  }, [location]);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setSearchResults(null);
    setDebugInfo(null);
    setSearchPerformed(true);
    
    // Scroll to search results smoothly
    setTimeout(() => {
      window.scrollTo({
        top: document.querySelector('.hero').offsetHeight - 20,
        behavior: 'smooth'
      });
    }, 500);
    
    try {
      const response = await searchService.searchProducts(query);
      
      if (response.success === false) {
        // API call succeeded but there was an issue with the search
        setError(response.message || 'The AI search encountered an issue. Please try a different query.');
        
        // Set debug info if available and in development mode
        if (response.debug && isDevelopment) {
          setDebugInfo(response.debug);
        }
      } else {
        setSearchResults(response);
      }
    } catch (err) {
      setError('Error connecting to the search service. Please try again later.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDebugInfo = (info) => {
    try {
      return JSON.stringify(info, null, 2);
    } catch (e) {
      return String(info);
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Smart Product Assistant</h1>
          <p>Find the perfect product with AI-powered recommendations</p>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </section>

      {searchPerformed && (
        <div className="search-content-container">
          {isLoading && (
            <div className="loading">
              <p>Analyzing your request and finding the best products for you...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
              {debugInfo && isDevelopment && (
                <div className="debug-section">
                  <h3>Debug Information</h3>
                  <pre className="debug-content">
                    {formatDebugInfo(debugInfo)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {searchResults && (
            <section className="results-section">
              <h2>Results for: <span className="query-text">{searchResults.query}</span></h2>
              
              {searchResults.recommendations.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 21L15 15" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>No matching products found</h3>
                  <p>{searchResults.message || 'Try adjusting your search query or explore our product categories.'}</p>
                </div>
              ) : (
                <div className="content-container">
                  {searchResults.model && (
                    <div className="model-info">
                      <p>Powered by: {searchResults.model}</p>
                    </div>
                  )}
                  <div className="results-list">
                    {searchResults.recommendations.map((recommendation, index) => (
                      <div 
                        className="product-card-wrapper" 
                        key={recommendation.productId}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <ProductCard
                          product={recommendation.product}
                          explanation={recommendation.explanation}
                          relevanceScore={recommendation.relevanceScore}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage; 