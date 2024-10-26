import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AsyncComponent from './components/common/AsyncComponent';
import LoadingSpinner from './components/common/LoadingSpinner';
import { authService } from './services/authService';
import { adminService } from './services/adminService';

// 懒加载组件
const Login = React.lazy(() => import('./components/auth/Login'));
const Register = React.lazy(() => import('./components/auth/Register'));
const AdminLogin = React.lazy(() => import('./components/admin/AdminLogin'));
const AdminPanel = React.lazy(() => import('./components/admin/AdminPanel'));
const MainApp = React.lazy(() => import('./components/MainApp'));

// 路由守卫组件
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isLoggedIn();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdminAuthenticated = adminService.isAdminLoggedIn();
  return isAdminAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isLoggedIn();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* 公共路由 - 未登录可访问 */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <AsyncComponent fallback={<LoadingSpinner />}>
              <Login />
            </AsyncComponent>
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <AsyncComponent fallback={<LoadingSpinner />}>
              <Register />
            </AsyncComponent>
          </PublicRoute>
        } 
      />
      
      {/* 管理员路由 */}
      <Route 
        path="/admin/login" 
        element={
          <AsyncComponent fallback={<LoadingSpinner />}>
            <AdminLogin />
          </AsyncComponent>
        } 
      />
      <Route 
        path="/admin/*" 
        element={
          <AdminRoute>
            <AsyncComponent fallback={<LoadingSpinner />}>
              <AdminPanel />
            </AsyncComponent>
          </AdminRoute>
        } 
      />
      
      {/* 需要登录才能访问的路由 */}
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <AsyncComponent fallback={<LoadingSpinner />}>
              <MainApp />
            </AsyncComponent>
          </PrivateRoute>
        } 
      />
      
      {/* 404重定向到首页 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;