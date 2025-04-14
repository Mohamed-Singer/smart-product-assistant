const axios = require('axios');
const Product = require('../models/Product');

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV !== 'production';

// OpenRouter configuration
const OPENROUTER_CONFIG = {
  baseUrl: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3-0324:free', // Default model
  retries: 3,
  timeout: 30000
};

/**
 * Make API call to OpenRouter with error handling and retries
 * @param {object} messages - Messages to send to the API
 * @returns {Promise<object>} - The API response
 */
async function callOpenRouter(messages, systemMessage = null) {
  let retries = 0;
  
  while (retries <= OPENROUTER_CONFIG.retries) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_CONFIG.apiKey}`
      };
      
      const payload = {
        model: OPENROUTER_CONFIG.model,
        messages: systemMessage 
          ? [{ role: 'system', content: systemMessage }, ...messages]
          : messages,
        response_format: { type: 'json_object' }
      };
      
      const response = await axios.post(
        `${OPENROUTER_CONFIG.baseUrl}/chat/completions`,
        payload,
        { 
          headers,
          timeout: OPENROUTER_CONFIG.timeout
        }
      );
      
      return response.data;
    } catch (error) {
      console.error(`OpenRouter API call failed (attempt ${retries + 1}):`, error.message);
      
      // Extract detailed error message from the response if available
      let errorMessage = 'API call failed';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error.message || error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Check if we should retry
      if (retries >= OPENROUTER_CONFIG.retries || 
          !(error.response && [429, 500, 502, 503, 504].includes(error.response.status))) {
        throw new Error(`LLM service error: ${errorMessage}`);
      }
      
      // Exponential backoff with jitter
      const delay = Math.min(1000 * Math.pow(2, retries), 10000) * (0.5 + Math.random() * 0.5);
      console.log(`Retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      retries++;
    }
  }
}

/**
 * Strip markdown code block formatting from content
 * @param {string} content - Raw content from LLM
 * @returns {string} - Cleaned content
 */
function stripMarkdownCodeBlocks(content) {
  if (!content) return content;
  
  // Remove markdown code block formatting
  // This handles ```json at start and ``` at end with optional whitespace
  return content
    .replace(/^```(json|javascript)?\s*/i, '')  // Remove opening ```json or ```javascript
    .replace(/\s*```\s*$/i, '')            // Remove closing ```
    .trim();
}

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false,
        message: 'Query is required' 
      });
    }

    // Fetch all products from the database
    const products = await Product.find();
    
    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        query,
        recommendations: [],
        message: 'No products in the catalog to search from'
      });
    }
    
    // Format products for the prompt
    const productsData = products.map(p => ({
      id: p._id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      attributes: Object.fromEntries(p.attributes || new Map())
    }));

    // System message
    const systemMessage = "You are a helpful product recommendation assistant that provides structured output in JSON format. You excel at understanding user needs and matching them to the most relevant products. Do not include markdown formatting like ```json in your response - just provide the raw JSON.";
    
    // Create a prompt for the LLM with improved instructions
    const promptContent = `
I want you to act as a smart product assistant for an e-commerce platform.
A user has entered the following query: "${query}"

Based on this query, analyze our product catalog and recommend the most relevant products.
For each recommended product, provide:
1. The exact productId from our database
2. A relevance score between 0 and 1 (only include products with score > 0.7)
3. A brief explanation of why it matches the user's query

Here is our product catalog in JSON format:
${JSON.stringify(productsData, null, 2)}

Your response MUST be valid JSON in this exact format:
{
  "recommendations": [
    {
      "productId": "product_id_here",
      "relevanceScore": 0.95,
      "explanation": "Brief explanation of why this product is relevant"
    }
  ]
}

IMPORTANT: 
- Return ONLY the raw JSON without any markdown formatting - do not include \`\`\`json or \`\`\` tags.
- Sort the recommendations by relevanceScore in descending order.
- Include only the most relevant products (max 5).
- If no products match the query well, return an empty recommendations array: { "recommendations": [] }
`;

    try {
      // Call OpenRouter API
      const response = await callOpenRouter([
        { role: "user", content: promptContent }
      ], systemMessage);
      
      if (!response.choices || !response.choices[0] || !response.choices[0].message) {
        // Return the raw response data for debugging
        return res.status(200).json({
          success: false,
          query,
          recommendations: [],
          message: 'Invalid response format from LLM service',
          ...(isDevelopment && { debug: { rawResponse: response } })
        });
      }
      
      let llmResponse;
      let rawContent = response.choices[0].message.content;
      let processedContent = stripMarkdownCodeBlocks(rawContent);
      
      try {
        // Parse the LLM response
        llmResponse = JSON.parse(processedContent);
      } catch (parseError) {
        // Return the raw content that couldn't be parsed
        return res.status(200).json({
          success: false,
          query,
          recommendations: [],
          message: 'Could not parse LLM response as JSON. The service returned an invalid format.',
          ...(isDevelopment && { 
            debug: {
              parseError: parseError.message,
              rawContent: rawContent,
              processedContent: processedContent
            }
          })
        });
      }
      
      if (!llmResponse.recommendations || !Array.isArray(llmResponse.recommendations)) {
        // Return the parsed but invalid response
        return res.status(200).json({
          success: false,
          query,
          recommendations: [],
          message: 'LLM response is missing the recommendations array',
          ...(isDevelopment && { debug: { parsedResponse: llmResponse } })
        });
      }
      
      // Fetch full product details for the recommendations
      const recommendations = await Promise.all(
        llmResponse.recommendations.map(async (rec) => {
          const product = products.find(p => p._id.toString() === rec.productId);
          if (!product) {
            console.warn(`Product with ID ${rec.productId} not found in database`);
          }
          return {
            ...rec,
            product: product || null
          };
        })
      );

      // Filter out any recommendations where the product wasn't found
      const validRecommendations = recommendations.filter(rec => rec.product !== null);

      if (validRecommendations.length === 0 && llmResponse.recommendations.length > 0) {
        // We had recommendations but none of the product IDs were valid
        return res.status(200).json({
          success: false,
          query,
          recommendations: [],
          message: 'The AI found matches but used invalid product IDs',
          ...(isDevelopment && { 
            debug: {
              invalidProductIds: llmResponse.recommendations.map(rec => rec.productId)
            }
          }),
          model: response.model || OPENROUTER_CONFIG.model
        });
      }

      // Return response with model info
      return res.status(200).json({
        success: true,
        query,
        recommendations: validRecommendations,
        model: response.model || OPENROUTER_CONFIG.model,
        provider: 'openrouter'
      });
    } catch (error) {
      console.error('LLM processing error:', error);
      
      // Return a more specific error message to the client
      return res.status(200).json({
        success: false,
        query,
        recommendations: [],
        message: 'AI search error: ' + error.message,
        model: OPENROUTER_CONFIG.model
      });
    }
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error processing search request', 
      error: error.message 
    });
  }
}; 