require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const mockProducts = [
  {
    name: 'Classic Red Roses',
    description: 'A timeless expression of love featuring 12 stunning long-stemmed red roses arranged beautifully.',
    price: 49.99,
    category: 'roses',
    imageUrl: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&q=80&w=600',
    stock: 50,
    isAvailable: true
  },
  {
    name: 'Spring Awakening Bouquet',
    description: 'A vibrant mix of colorful spring flowers including tulips, daffodils, and hyacinths.',
    price: 54.99,
    category: 'bouquets',
    imageUrl: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80&w=600',
    stock: 30,
    isAvailable: true
  },
  {
    name: 'Elegant White Lilies',
    description: 'Pure and elegant white lilies symbolizing peace and purity. Perfect for sympathy or elegant decor.',
    price: 59.99,
    category: 'bouquets',
    imageUrl: 'https://images.unsplash.com/photo-1508609565-d01c0bb1415e?auto=format&fit=crop&q=80&w=600',
    stock: 25,
    isAvailable: true
  },
  {
    name: 'Autumn Spice Arrangement',
    description: 'Warm terracotta and sage hues featuring sunflowers, orange roses, and seasonal greenery.',
    price: 64.99,
    category: 'seasonal',
    imageUrl: 'https://images.unsplash.com/photo-1473187983305-f62f3de15cce?auto=format&fit=crop&q=80&w=600',
    stock: 15,
    isAvailable: true
  },
  {
    name: 'Luxury Spa Flower Set',
    description: 'A beautiful small bouquet bundled with premium bath bombs and scented candles.',
    price: 89.99,
    category: 'gifts',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb0d9c71?auto=format&fit=crop&q=80&w=600',
    stock: 10,
    isAvailable: true
  },
  {
    name: 'Pink Peony Delight',
    description: 'Lush, fragrant pink peonies arranged beautifully in a glass vase.',
    price: 79.99,
    category: 'bouquets',
    imageUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=600',
    stock: 20,
    isAvailable: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Clearing old products...');
    await Product.deleteMany();
    
    console.log('Inserting mock products...');
    await Product.insertMany(mockProducts);
    
    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with data import', error);
    process.exit(1);
  }
};

seedDatabase();
