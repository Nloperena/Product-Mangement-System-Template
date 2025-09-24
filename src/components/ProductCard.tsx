import React from 'react';
import type { Product } from '../types/Product';
import { formatPrice, formatDate } from '../utils/productUtils';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  return (
    <div className="product-card">
      <div className="product-header">
        <h3 className="product-name">{product.name}</h3>
        <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
      <p className="product-description">{product.description}</p>
      <div className="product-details">
        <span className="product-price">{formatPrice(product.price)}</span>
        <span className="product-category">{product.category}</span>
      </div>
      <div className="product-meta">
        <span className="created-date">Created: {formatDate(product.createdAt)}</span>
      </div>
      <div className="product-actions">
        <button 
          className="btn btn-primary" 
          onClick={() => onEdit(product)}
        >
          Edit
        </button>
        <button 
          className="btn btn-danger" 
          onClick={() => onDelete(product.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;