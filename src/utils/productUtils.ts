import type { Product } from '../types/Product';

export const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Laptop",
    description: "High-performance laptop for professional use",
    price: 1299.99,
    category: "Electronics",
    inStock: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    name: "Office Chair",
    description: "Ergonomic office chair with lumbar support",
    price: 299.99,
    category: "Furniture",
    inStock: true,
    createdAt: new Date('2024-01-20')
  },
  {
    id: 3,
    name: "Wireless Mouse",
    description: "Bluetooth wireless mouse with precision tracking",
    price: 49.99,
    category: "Electronics",
    inStock: false,
    createdAt: new Date('2024-01-22')
  }
];

export const generateId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};