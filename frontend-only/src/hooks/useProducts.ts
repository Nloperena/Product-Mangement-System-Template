import { useState, useEffect } from 'react';
import { productApi } from '@/services/api';
import type { Product, ProductFilters } from '@/types/product';

export const useProducts = (filters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productApi.getProducts();
      console.log('🔍 useProducts: Fetched products:', data.length);
      console.log('🔍 useProducts: Sample product IDs:', data.slice(0, 5).map(p => ({ id: p.id, product_id: p.product_id, name: p.name })));
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (filters?.brand && product.brand !== filters.brand) {
      return false;
    }
    
    if (filters?.industry && product.industry !== filters.industry) {
      return false;
    }
    
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = [
        product.name,
        product.full_name,
        product.description,
        ...product.benefits,
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }
    
    if (filters?.published !== undefined && product.published !== filters.published) {
      return false;
    }
    
    return true;
  });

  return {
    products: filteredProducts,
    allProducts: products,
    loading,
    error,
    refetch: fetchProducts,
  };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('🔍 useProduct: Fetching product with ID:', id);
        const data = await productApi.getProduct(id);
        console.log('✅ useProduct: Product fetched successfully:', data);
        setProduct(data);
      } catch (err) {
        console.error('❌ useProduct: Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return {
    product,
    loading,
    error,
  };
};
