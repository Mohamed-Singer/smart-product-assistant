import React, { useState } from 'react';
import './SearchBar.css';

const EXAMPLE_QUERIES = [
  "What's a good laptop for college students?",
  "I need a waterproof camera for vacation",
  "Best headphones for running",
  "Gift ideas for coffee lovers"
];

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleExampleClick = (exampleQuery) => {
    setQuery(exampleQuery);
    onSearch(exampleQuery);
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Ask me anything about products you need..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="search-button"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      <div className="search-examples">
        <p>Try an example:</p>
        <div className="examples-buttons">
          {EXAMPLE_QUERIES.map((exampleQuery, index) => (
            <button
              key={index}
              type="button"
              className="example-button"
              onClick={() => handleExampleClick(exampleQuery)}
              disabled={isLoading}
            >
              {exampleQuery}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 