import type { Product, ProductStats, BrandIndustryCounts, ProductFormData } from '@/types/product';
import { mockProducts, mockStats, mockBrandIndustryCounts, mockImages } from './mockData';

// Frontend-only deployment using mock data
const IS_DEMO_MODE = true;

// Simulate API delay for realistic demo experience
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productApi = {
  // Get all products
  async getProducts(): Promise<Product[]> {
    if (IS_DEMO_MODE) {
      await delay(500); // Simulate network delay
      return [...mockProducts];
    }
    // Real API call would go here
    throw new Error('Backend API not available in demo mode');
  },

  // Get product by ID
  async getProduct(id: string): Promise<Product> {
    if (IS_DEMO_MODE) {
      await delay(300);
      const product = mockProducts.find(p => p.id === id);
      if (!product) {
        throw new Error('Product not found');
      }
      return { ...product };
    }
    throw new Error('Backend API not available in demo mode');
  },

  // Create new product
  async createProduct(productData: ProductFormData): Promise<{ success: boolean; message: string; product_id?: string }> {
    if (IS_DEMO_MODE) {
      await delay(800);
      // In demo mode, we simulate success but don't actually persist data
      return {
        success: true,
        message: 'Product created successfully (Demo Mode - changes not persisted)',
        product_id: Math.random().toString(36).substr(2, 9)
      };
    }
    throw new Error('Backend API not available in demo mode');
  },

  // Update product
  async updateProduct(id: string, productData: Partial<ProductFormData>): Promise<{ success: boolean; message: string }> {
    if (IS_DEMO_MODE) {
      await delay(600);
      const productExists = mockProducts.some(p => p.id === id);
      if (!productExists) {
        throw new Error('Product not found');
      }
      return {
        success: true,
        message: 'Product updated successfully (Demo Mode - changes not persisted)'
      };
    }
    throw new Error('Backend API not available in demo mode');
  },

  // Delete product
  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    if (IS_DEMO_MODE) {
      await delay(400);
      const productExists = mockProducts.some(p => p.id === id);
      if (!productExists) {
        throw new Error('Product not found');
      }
      return {
        success: true,
        message: 'Product deleted successfully (Demo Mode - changes not persisted)'
      };
    }
    throw new Error('Backend API not available in demo mode');
  },

  // Get statistics
  async getStatistics(): Promise<{
    metadata: ProductStats;
    brand_industry_counts: BrandIndustryCounts;
  }> {
    if (IS_DEMO_MODE) {
      await delay(400);
      return {
        metadata: { ...mockStats },
        brand_industry_counts: { ...mockBrandIndustryCounts }
      };
    }
    throw new Error('Backend API not available in demo mode');
  },

  // Get available images
  async getImages(): Promise<Array<{
    filename: string;
    path: string;
    size: number;
  }>> {
    if (IS_DEMO_MODE) {
      await delay(300);
      return [...mockImages];
    }
    throw new Error('Backend API not available in demo mode');
  },

  // Upload image
  async uploadImage(file: File): Promise<{
    success: boolean;
    message: string;
    filename?: string;
    filepath?: string;
  }> {
    if (IS_DEMO_MODE) {
      await delay(1000);
      return {
        success: true,
        message: 'Image uploaded successfully (Demo Mode - not actually uploaded)',
        filename: file.name,
        filepath: '/placeholder-product.svg'
      };
    }
    throw new Error('Backend API not available in demo mode');
  },
};

export default productApi;
