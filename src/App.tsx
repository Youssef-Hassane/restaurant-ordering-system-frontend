import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="order-success" element={<OrderSuccessPage />} />
        
        {/* Admin/Manager Only: Product Management */}
        <Route path="admin/products" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminProductsPage />
          </ProtectedRoute>
        } />
        
        {/* All Staff: Order Management */}
        <Route path="admin/orders" element={
          <ProtectedRoute allowedRoles={['admin', 'manager', 'cashier']}>
            <AdminOrdersPage />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

export default App;