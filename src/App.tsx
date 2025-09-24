import { useState } from 'react'
import type { Product, ProductFormData } from './types/Product'
import { sampleProducts, generateId } from './utils/productUtils'
import ProductList from './components/ProductList'
import ProductForm from './components/ProductForm'
import './App.css'

function App() {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  const handleAddProduct = (productData: ProductFormData) => {
    const newProduct: Product = {
      ...productData,
      id: generateId(),
      createdAt: new Date()
    }
    setProducts(prev => [newProduct, ...prev])
    setIsFormOpen(false)
  }

  const handleEditProduct = (productData: ProductFormData) => {
    if (!editingProduct) return
    
    setProducts(prev => prev.map(product => 
      product.id === editingProduct.id 
        ? { ...product, ...productData }
        : product
    ))
    setEditingProduct(undefined)
    setIsFormOpen(false)
  }

  const handleDeleteProduct = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(product => product.id !== id))
    }
  }

  const openEditForm = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const openAddForm = () => {
    setEditingProduct(undefined)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingProduct(undefined)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(products.map(p => p.category))).sort()

  return (
    <div className="app">
      <header className="app-header">
        <h1>Product Management System</h1>
        <p>Manage your product inventory with ease</p>
      </header>

      <div className="app-content">
        <div className="controls">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <button 
            className="btn btn-primary add-product-btn"
            onClick={openAddForm}
          >
            Add Product
          </button>
        </div>

        <div className="products-summary">
          <span>Total Products: {products.length}</span>
          <span>Filtered Results: {filteredProducts.length}</span>
          <span>In Stock: {products.filter(p => p.inStock).length}</span>
        </div>

        <ProductList
          products={filteredProducts}
          onEdit={openEditForm}
          onDelete={handleDeleteProduct}
        />

        {isFormOpen && (
          <ProductForm
            product={editingProduct}
            onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
            onCancel={closeForm}
          />
        )}
      </div>
    </div>
  )
}

export default App
