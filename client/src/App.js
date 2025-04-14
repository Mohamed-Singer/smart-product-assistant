import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import './App.css';

// Create a context to store search state
export const SearchContext = createContext(null);

function App() {
  // State to store search results across navigation
  const [searchResults, setSearchResults] = useState(null);
  
  return (
    <SearchContext.Provider value={{ searchResults, setSearchResults }}>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
            </Routes>
          </main>
          <footer className="footer">
            <div className="container">
              <p>&copy; {new Date().getFullYear()} Smart Product Assistant</p>
            </div>
          </footer>
        </div>
      </Router>
    </SearchContext.Provider>
  );
}

export default App;
