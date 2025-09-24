import type { Product, ProductStats, BrandIndustryCounts } from '@/types/product';

// Mock data for frontend-only deployment
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    brand: 'AudioTech',
    industry: 'Electronics',
    price: 299.99,
    cost: 150.00,
    stock: 45,
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    image: '/placeholder-product.svg',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    brand: 'FitTech',
    industry: 'Electronics',
    price: 199.99,
    cost: 120.00,
    stock: 32,
    description: 'Advanced fitness tracking with heart rate monitoring and GPS.',
    image: '/placeholder-product.svg',
    created_at: '2024-01-16T14:20:00Z',
    updated_at: '2024-01-16T14:20:00Z'
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    brand: 'EcoWear',
    industry: 'Fashion',
    price: 29.99,
    cost: 15.00,
    stock: 120,
    description: 'Sustainable and comfortable organic cotton t-shirt.',
    image: '/placeholder-product.svg',
    created_at: '2024-01-17T09:15:00Z',
    updated_at: '2024-01-17T09:15:00Z'
  },
  {
    id: '4',
    name: 'Professional Camera Lens',
    brand: 'PhotoPro',
    industry: 'Electronics',
    price: 899.99,
    cost: 500.00,
    stock: 8,
    description: 'Professional-grade camera lens for photography enthusiasts.',
    image: '/placeholder-product.svg',
    created_at: '2024-01-18T16:45:00Z',
    updated_at: '2024-01-18T16:45:00Z'
  },
  {
    id: '5',
    name: 'Luxury Leather Wallet',
    brand: 'CraftLeather',
    industry: 'Fashion',
    price: 149.99,
    cost: 75.00,
    stock: 25,
    description: 'Handcrafted luxury leather wallet with RFID protection.',
    image: '/placeholder-product.svg',
    created_at: '2024-01-19T11:30:00Z',
    updated_at: '2024-01-19T11:30:00Z'
  }
];

export const mockStats: ProductStats = {
  total_products: mockProducts.length,
  total_value: mockProducts.reduce((sum, product) => sum + (product.price * product.stock), 0),
  low_stock_count: mockProducts.filter(product => product.stock < 20).length,
  out_of_stock_count: mockProducts.filter(product => product.stock === 0).length,
  avg_price: mockProducts.reduce((sum, product) => sum + product.price, 0) / mockProducts.length
};

export const mockBrandIndustryCounts: BrandIndustryCounts = {
  brands: mockProducts.reduce((acc, product) => {
    acc[product.brand] = (acc[product.brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>),
  industries: mockProducts.reduce((acc, product) => {
    acc[product.industry] = (acc[product.industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
};

export const mockImages = [
  {
    filename: 'placeholder-product.svg',
    path: '/placeholder-product.svg',
    size: 1024
  }
];
