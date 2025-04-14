# Smart Product Assistant

An AI-powered e-commerce application that uses natural language processing to help users find products through conversational queries.

## Overview

Smart Product Assistant demonstrates how AI can transform the e-commerce experience by understanding natural language queries and matching them with relevant products. Users can search for products using conversational language rather than keywords, and receive recommendations ranked by relevance with explanations for why each product matches their needs.

## Features

- **Natural Language Search**: Ask for products in plain English (e.g., "I need a lightweight laptop for college")
- **AI-Powered Recommendations**: Get tailored product suggestions based on your specific needs
- **Relevance Scoring**: See how well each product matches your request
- **Explanations**: Understand why each product was recommended

## Tech Stack

- **Frontend**: React 19, React Router 7
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **AI Integration**: OpenRouter API (multi-model LLM gateway)
- **Styling**: Custom CSS with responsive design

## Installation Guide

### Prerequisites

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **MongoDB**: Local instance or MongoDB Atlas account ([Sign up](https://www.mongodb.com/cloud/atlas/register))
- **OpenRouter API Key**: For AI-powered search ([Sign up](https://openrouter.ai/))

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/smart-product-assistant.git
cd smart-product-assistant
```

### Step 2: Set Up the Backend

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the server directory:

```bash
touch .env
```

4. Add the following environment variables to the `.env` file:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/smart-product-assistant
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=deepseek/deepseek-chat-v3-0324:free
```

### Step 3: Set Up the Frontend

1. Navigate to the client directory:

```bash
cd ../client
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the client directory:

```bash
touch .env
```

4. Add the following to the client `.env` file to set the development port:

```
PORT=3001
```

## Obtaining API Keys

### MongoDB Atlas Setup

If you prefer using MongoDB Atlas over a local MongoDB installation:

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster (the free tier is sufficient)
3. Under "Database Access," create a database user with read/write permissions
4. Under "Network Access," add your IP address or allow access from anywhere for development
5. Under "Databases," click "Connect" on your cluster, select "Connect your application," and copy the connection string
6. Replace `mongodb://localhost:27017/smart-product-assistant` in your server `.env` file with the connection string (don't forget to replace `<password>` with your database user's password)

### OpenRouter API Key

1. Go to [OpenRouter](https://openrouter.ai/) and create an account
2. Navigate to "API Keys" in your dashboard
3. Create a new API key (you may need to set up billing, but many models have free tiers)
4. Copy the key and paste it as the value for `OPENROUTER_API_KEY` in your server `.env` file

## Running the Application

### Seed the Database with Sample Products

1. In the server directory, run:

```bash
npm run seed
```

This will populate your database with sample products for testing.

### Start the Backend Server

1. In the server directory, run:

```bash
npm run dev
```

The server will start on port 3000.

### Start the Frontend Application

1. In a new terminal, navigate to the client directory and run:

```bash
npm start
```

The React application will start on port 3001 and should automatically open in your browser.

## Usage

1. Once both the frontend and backend are running, open http://localhost:3001 in your browser
2. Enter a natural language query in the search bar, such as:
   - "I need a lightweight laptop for college"
   - "What's a good gift for a coffee enthusiast?"
   - "Recommend waterproof headphones for swimming"
3. Review the AI-generated recommendations, which include:
   - Relevance scores showing how well each product matches your query
   - Explanations of why each product was recommended
   - Product details like price, description, and images

## Development

### Project Structure

```
smart-product-assistant/
├── client/               # React frontend 
│   ├── public/           # Static files
│   └── src/              # React source files
│       ├── components/   # UI components
│       ├── pages/        # Page components
│       └── services/     # API services
│
└── server/               # Node.js backend
    ├── config/           # Configuration files
    ├── controllers/      # Request handlers
    ├── data/             # Sample data and seed scripts
    ├── models/           # Database models
    └── routes/           # API routes
```

### Environment Modes

The application has different behaviors in development vs. production:

- **Development Mode**: Shows detailed debug information for AI/LLM responses
- **Production Mode**: Hides debug information for a cleaner user experience

## API Documentation

### Products API

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product by ID
- `GET /api/products/category/:category` - Get products by category

### Search API

- `POST /api/search` - Search products with natural language query
  - Request body: `{ "query": "string" }`
  - Response: 
  ```json
  {
    "success": true,
    "query": "user query",
    "recommendations": [
      {
        "productId": "123",
        "relevanceScore": 0.95,
        "explanation": "This matches because...",
        "product": {
          "name": "Product Name",
          "description": "Product description",
          "price": 99.99,
          "category": "Category",
          "imageUrl": "https://example.com/image.jpg"
        }
      }
    ],
    "model": "deepseek/deepseek-chat-v3-0324:free",
    "provider": "openrouter"
  }
  ```

## LLM Integration Approach

The application uses a carefully engineered prompt system to convert natural language queries into relevant product recommendations:

### Prompt Engineering Strategy

1. **Context Setting**: The system provides the LLM with the entire product catalog in a structured format.
   
2. **Clear Instructions**: The prompt explicitly defines the expected output format and scoring criteria.
   
3. **Response Parsing**: The backend validates and processes the LLM response before sending it to the frontend.

### Model Selection Considerations

The application uses OpenRouter as an API gateway to access various LLM models:

- Default model is set to `deepseek/deepseek-chat-v3-0324:free` for good performance with minimal cost
- The model can be easily changed in the .env file to use more powerful models like GPT-4 or Claude
- Response format is specified as JSON to ensure consistent parsing

### Error Handling and Resilience

- Implements retry logic with exponential backoff for API failures
- Includes fallback mechanisms for parsing issues
- Development mode exposes detailed debug information about LLM responses

## Trade-offs and Future Improvements

### Current Trade-offs

1. **Catalog Size vs. Performance**: The current implementation loads the entire product catalog into the LLM context window, which limits the number of products that can be searched at once.

2. **Model Selection vs. Cost**: Using free-tier models provides cost savings but may result in less accurate recommendations compared to more advanced models.

3. **Simple Relevance Scoring**: The current approach relies on the LLM to provide relevance scores without additional machine learning techniques.

### Future Improvements

1. **Enhanced Search Capabilities**:
   - Implement vector embeddings for product descriptions to enable semantic search beyond LLM capabilities
   - Add filters for price range, categories, and other attributes
   - Implement search history and personalized recommendations

2. **User Experience Enhancements**:
   - Add user accounts and saved preferences
   - Implement shopping cart functionality
   - Add product comparison features
   - Create mobile application versions

3. **Infrastructure Improvements**:
   - Set up proper caching for frequent queries
   - Add comprehensive analytics tracking
   - Implement A/B testing for different recommendation algorithms
   - Create a proper CI/CD pipeline with automated testing

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenRouter for providing access to multiple LLM models
- MongoDB Atlas for cloud database services
