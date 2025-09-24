import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatBrandName, formatIndustryName } from '@/utils/formatting';
import { 
  Search, 
  Plus, 
  Package, 
  Grid3X3, 
  List,
  SlidersHorizontal,
  X
} from 'lucide-react';
import type { Product, ProductFilters } from '@/types/product';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [showPublishedOnly, setShowPublishedOnly] = useState<boolean | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filters: ProductFilters = useMemo(() => ({
    search: searchTerm || undefined,
    brand: selectedBrand || undefined,
    industry: selectedIndustry || undefined,
    published: showPublishedOnly,
  }), [searchTerm, selectedBrand, selectedIndustry, showPublishedOnly]);

  const { products, allProducts, loading, error } = useProducts(filters);

  // Get unique brands and industries for filters
  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(allProducts.map(p => p.brand)));
    return uniqueBrands.sort();
  }, [allProducts]);

  const industries = useMemo(() => {
    const uniqueIndustries = Array.from(new Set(allProducts.map(p => p.industry)));
    return uniqueIndustries.sort();
  }, [allProducts]);

  const handleProductView = (product: Product) => {
    navigate(`/products/${product.product_id || product.id}`);
  };

  const handleProductEdit = (product: Product) => {
    navigate(`/products/${product.product_id || product.id}/edit`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBrand('');
    setSelectedIndustry('');
    setShowPublishedOnly(undefined);
  };

  const activeFiltersCount = [
    searchTerm,
    selectedBrand,
    selectedIndustry,
    showPublishedOnly !== undefined ? 'published' : null
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl h-64"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            {products.length} of {allProducts.length} products
          </p>
        </div>
        <Link to="/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products by name, benefits, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="default" className="ml-1 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="gap-2 text-sm"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}

          <div className="flex-1" />

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="p-2"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="p-2"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {formatBrandName(brand)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Industry Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">All Industries</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {formatIndustryName(industry)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Published Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={showPublishedOnly === undefined ? '' : showPublishedOnly.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setShowPublishedOnly(value === '' ? undefined : value === 'true');
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">All Status</option>
                  <option value="true">Published Only</option>
                  <option value="false">Drafts Only</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid/List */}
      {products.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={handleProductView}
              onEdit={handleProductEdit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h2>
          <p className="text-gray-600 mb-6">
            {activeFiltersCount > 0 
              ? "No products match your current filters. Try adjusting your search criteria."
              : "You haven't added any products yet."
            }
          </p>
          {activeFiltersCount > 0 ? (
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          ) : (
            <Link to="/products/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Product
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
