import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/ToastContainer';
import { ApiProvider } from '@/contexts/ApiContext';
import { GuestProvider } from '@/contexts/GuestContext';
import Layout from '@/components/layout/Layout';
import AuthGuard from '@/components/guards/AuthGuard';
import Dashboard from '@/pages/Dashboard';
import ProductsPage from '@/pages/ProductsPage';
import ProductViewPage from '@/pages/ProductViewPage';
import ProductEditPage from '@/pages/ProductEditPage';

const App: React.FC = () => {
  return (
    <GuestProvider>
      <ApiProvider>
        <ToastProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/new" element={
                  <AuthGuard>
                    <ProductEditPage />
                  </AuthGuard>
                } />
                <Route path="/products/:id" element={<ProductViewPage />} />
                <Route path="/products/:id/edit" element={
                  <AuthGuard>
                    <ProductEditPage />
                  </AuthGuard>
                } />
                <Route path="*" element={
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                    <p className="text-gray-600">The page you're looking for doesn't exist.</p>
                  </div>
                } />
              </Routes>
            </Layout>
          </Router>
        </ToastProvider>
      </ApiProvider>
    </GuestProvider>
  );
};

export default App;
