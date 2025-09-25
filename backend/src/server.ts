import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';

// Import routes
import productRoutes from './routes/products';
import imageRoutes from './routes/images';
import statsRoutes from './routes/statistics';

// Import database service
import { databaseService } from './services/database';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 5000;

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// CORS configuration - simplified and clean
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    process.env['FRONTEND_URL'] || 'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Origin', 
    'X-Requested-With', 
    'Content-Type', 
    'Accept', 
    'Authorization'
  ]
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Safer debugging middleware using response finish event
app.use((req, res, next) => {
  console.log(`\n🔍 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log(`   Origin: ${req.headers.origin || 'No origin'}`);
  
  // Log response info once the response is finished (safer than monkey-patching)
  res.on('finish', () => {
    console.log(`   Response status: ${res.statusCode}`);
    console.log(`   Response headers:`, JSON.stringify(res.getHeaders(), null, 2));
  });
  
  next();
});

// Serve product images directly from /product-images URL
app.use('/product-images', express.static(path.join(__dirname, '../public/uploads/product-images'), {
  setHeaders: (res, filePath) => {
    // Apply CORS headers to all static assets
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

    // Apply stronger caching to images
    if (filePath.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year
    }
  }
}));


// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV'] || 'development'
  });
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/statistics', statsRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database connection
    console.log('Initializing database...');
    await databaseService.connect();
    await databaseService.initializeDatabase();
    
    // Initialize ProductModel to create tables
    const { ProductModel } = require('./models/Product');
    new ProductModel(databaseService.getDatabase());
    console.log('Database tables initialized');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🖼️  Static files: http://localhost:${PORT}/public`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    console.error('Error details:', error);
    process.exit(1);
  }
}

startServer();

export default app;
