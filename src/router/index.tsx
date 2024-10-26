import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { adminService } from '../services/adminService';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import AdminLogin from '../components/admin/AdminLogin';
import AdminPanel from '../components/admin/AdminPanel';
import MainApp from '../components/MainApp';
import NotificationBanner from '../components/NotificationBanner';

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

function AppRouter() {
  return (
    <BrowserRouter>
      <NotificationBanner />
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminRoute><AdminPanel onLogout={() => adminService.logout()} /></AdminRoute>} />
        <Route path="/" element={<PrivateRoute><MainApp /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;