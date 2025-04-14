require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const sampleProducts = [
  {
    name: "MacBook Air M2",
    description: "Lightweight and powerful laptop with Apple's M2 chip, perfect for students and professionals on the go.",
    price: 999.99,
    category: "Laptops",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
    attributes: {
      weight: "2.7 lbs",
      processor: "Apple M2",
      memory: "8GB",
      storage: "256GB SSD",
      color: "Silver",
      batteryLife: "18 hours"
    }
  },
  {
    name: "Dell XPS 13",
    description: "Ultra-thin Windows laptop with InfinityEdge display and powerful Intel processor.",
    price: 899.99,
    category: "Laptops",
    imageUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
    attributes: {
      weight: "2.8 lbs",
      processor: "Intel Core i7",
      memory: "16GB",
      storage: "512GB SSD",
      color: "Platinum Silver",
      batteryLife: "12 hours"
    }
  },
  {
    name: "Acer Chromebook 14",
    description: "Affordable and lightweight Chromebook, perfect for basic tasks and web browsing.",
    price: 299.99,
    category: "Laptops",
    imageUrl: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
    attributes: {
      weight: "3.42 lbs",
      processor: "Intel Celeron",
      memory: "4GB",
      storage: "64GB eMMC",
      color: "Black",
      batteryLife: "10 hours"
    }
  },
  {
    name: "Chemex Pour-Over Coffee Maker",
    description: "Elegant glass pour-over coffee maker that produces clean, flavorful coffee through a bonded filter.",
    price: 45.99,
    category: "Coffee",
    imageUrl: "https://images.unsplash.com/photo-1545665225-b23b99e4d45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
    attributes: {
      capacity: "6 cups",
      material: "Borosilicate glass",
      color: "Clear with wooden collar",
      type: "Pour-over"
    }
  },
  {
    name: "Baratza Encore Burr Grinder",
    description: "Entry-level conical burr grinder perfect for home brewing enthusiasts.",
    price: 139.99,
    category: "Coffee",
    imageUrl: "https://images.unsplash.com/photo-1580933073521-dc49ac0d4e6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
    attributes: {
      grindSettings: "40 settings",
      color: "Black",
      type: "Burr grinder",
      hopper: "8oz capacity"
    }
  },
  {
    name: "Coffee Gator Pour Over Set",
    description: "Complete pour-over coffee brewing kit with reusable stainless steel filter.",
    price: 29.99,
    category: "Coffee",
    imageUrl: "https://images.unsplash.com/photo-1575279146056-963c4a35627b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
    attributes: {
      capacity: "3 cups",
      material: "Borosilicate glass and stainless steel",
      filterType: "Reusable",
      color: "Clear with copper collar"
    }
  },
  {
    name: "Sony WH-1000XM4 Headphones",
    description: "Industry-leading noise canceling wireless headphones with exceptional sound quality.",
    price: 349.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
    attributes: {
      color: "Black",
      batteryLife: "30 hours",
      noiseCancel: "Yes",
      wireless: "Yes",
      type: "Over-ear"
    }
  },
  {
    name: "Apple AirPods Pro",
    description: "Wireless earbuds with active noise cancellation and transparency mode.",
    price: 249.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
    attributes: {
      color: "White",
      batteryLife: "4.5 hours",
      noiseCancel: "Yes",
      wireless: "Yes",
      type: "In-ear"
    }
  },
  {
    name: "Kindle Paperwhite",
    description: "Waterproof e-reader with glare-free display and adjustable warm light.",
    price: 139.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
    attributes: {
      storage: "8GB",
      resolution: "300 ppi",
      batteryLife: "Weeks",
      waterproof: "Yes",
      screenSize: "6 inches"
    }
  },
  {
    name: "Patagonia Better Sweater",
    description: "Warm fleece jacket made with 100% recycled polyester fleece.",
    price: 139.00,
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
    attributes: {
      gender: "Unisex",
      material: "Recycled polyester",
      color: "Navy Blue",
      type: "Jacket",
      size: "Medium"
    }
  },
  {
    name: "Adidas Ultraboost 21",
    description: "Running shoes with responsive Boost midsole and Primeknit upper for adaptive support.",
    price: 180.00,
    category: "Footwear",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
    attributes: {
      gender: "Unisex",
      color: "Black/White",
      type: "Running",
      size: "US 9",
      material: "Primeknit"
    }
  },
  {
    name: "Hydro Flask Water Bottle",
    description: "Insulated stainless steel water bottle that keeps beverages cold for up to 24 hours and hot for up to 12 hours.",
    price: 39.95,
    category: "Outdoor",
    imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
    attributes: {
      capacity: "32 oz",
      material: "Stainless steel",
      insulated: "Yes",
      color: "Pacific Blue",
      dishwasherSafe: "Yes"
    }
  },
  {
    name: "YETI Tundra 45 Cooler",
    description: "Heavy-duty cooler that keeps ice for days and is virtually indestructible.",
    price: 299.99,
    category: "Outdoor",
    imageUrl: "https://images.unsplash.com/photo-1622997203833-a5af0bd5ab06?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
    attributes: {
      capacity: "45 quarts",
      material: "Rotomolded polyethylene",
      color: "White",
      iceRetention: "3+ days",
      bearResistant: "Yes"
    }
  },
  {
    name: "PlayStation 5",
    description: "Next-generation gaming console with ultra-high speed SSD and 3D audio technology.",
    price: 499.99,
    category: "Gaming",
    imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
    attributes: {
      storage: "825GB SSD",
      controller: "DualSense",
      color: "White",
      resolution: "4K",
      hdmi: "HDMI 2.1"
    }
  },
  {
    name: "Nintendo Switch OLED",
    description: "Hybrid gaming console with vibrant 7-inch OLED screen and enhanced audio.",
    price: 349.99,
    category: "Gaming",
    imageUrl: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
    attributes: {
      storage: "64GB",
      screenType: "OLED",
      screenSize: "7 inches",
      color: "White",
      batteryLife: "4.5-9 hours"
    }
  }
];

// Convert attributes objects to Maps for MongoDB
const productsWithMaps = sampleProducts.map(product => {
  const attributes = new Map();
  for (const [key, value] of Object.entries(product.attributes)) {
    attributes.set(key, value);
  }
  return { ...product, attributes };
});

// Connect to MongoDB and seed the database
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');

    // Delete existing data
    await Product.deleteMany({});
    console.log('Deleted existing products');

    // Insert sample products
    await Product.insertMany(productsWithMaps);
    console.log('Inserted sample products');

    mongoose.connection.close();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase(); 