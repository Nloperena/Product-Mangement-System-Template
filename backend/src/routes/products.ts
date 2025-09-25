import express from 'express';
import { ProductController } from '../controllers/productController';

const router = express.Router();

// Lazy initialization of controller to avoid database connection issues
let productController: ProductController | null = null;

function getProductController(): ProductController {
  if (!productController) {
    productController = new ProductController();
  }
  return productController;
}

// GET /api/products - Get all products
router.get('/', (req, res) => getProductController().getAllProducts(req, res));

// GET /api/products/:id - Get product by ID
router.get('/:id', (req, res) => getProductController().getProductById(req, res));

// POST /api/products - Create new product
router.post('/', (req, res) => getProductController().createProduct(req, res));

// PUT /api/products/:id - Update product
router.put('/:id', (req, res) => getProductController().updateProduct(req, res));

// DELETE /api/products/:id - Delete product
router.delete('/:id', (req, res) => getProductController().deleteProduct(req, res));

// GET /api/products/statistics - Get product statistics
router.get('/statistics', (req, res) => getProductController().getStatistics(req, res));

export default router;