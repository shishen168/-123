import React, { useState } from 'react';
import { Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import MatrixRain from '../effects/MatrixRain';

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.username || !formData.password) {
      setError('请输入用户名和密码');
      setLoading(false);
      return;
    }

    const success = adminService.login(formData.username, formData.password);
    
    if (success) {
      navigate('/admin');
    } else {
      setError('用户名或密码错误');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <MatrixRain />
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6">管理员登录</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="请输入管理员用户名"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="请输入管理员密码"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                登录
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;