import React, { useState, useEffect } from 'react';
import { Search, Eye, EyeOff, Save } from 'lucide-react';
import { userService, UserCredentials } from '../../services/userService';

function UserSettings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserCredentials[]>([]);
  const [showPassword, setShowPassword] = useState<{[key: string]: boolean}>({});
  const [editingUser, setEditingUser] = useState<{[key: string]: UserCredentials}>({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(userService.getCredentials());
  };

  const handleEdit = (user: UserCredentials) => {
    setEditingUser({
      ...editingUser,
      [user.id]: { ...user }
    });
  };

  const handleSave = (id: string) => {
    if (!editingUser[id]) return;

    const { password } = editingUser[id];
    const passwordValidation = userService.validatePassword(password);
    
    if (!passwordValidation.valid) {
      setError(passwordValidation.message || '密码格式不正确');
      return;
    }

    const success = userService.updateUserCredentials(id, editingUser[id]);
    
    if (success) {
      loadUsers();
      const newEditingUser = { ...editingUser };
      delete newEditingUser[id];
      setEditingUser(newEditingUser);
      setSuccess('用户信息已更新');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('更新用户信息失败');
    }
  };

  const handleCancel = (id: string) => {
    const newEditingUser = { ...editingUser };
    delete newEditingUser[id];
    setEditingUser(newEditingUser);
    setError('');
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">用户账号设置</h2>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索用户..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">密码</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最后修改时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser[user.id] ? (
                    <input
                      type="email"
                      value={editingUser[user.id].email}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        [user.id]: { ...editingUser[user.id], email: e.target.value }
                      })}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{user.email}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser[user.id] ? (
                    <input
                      type="text"
                      value={editingUser[user.id].username}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        [user.id]: { ...editingUser[user.id], username: e.target.value }
                      })}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{user.username}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {editingUser[user.id] ? (
                      <div className="relative flex-1">
                        <input
                          type={showPassword[user.id] ? 'text' : 'password'}
                          value={editingUser[user.id].password}
                          onChange={(e) => setEditingUser({
                            ...editingUser,
                            [user.id]: { ...editingUser[user.id], password: e.target.value }
                          })}
                          className="w-full px-2 py-1 border rounded"
                        />
                        <button
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        >
                          {showPassword[user.id] ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-900">••••••••</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.lastPasswordChange}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingUser[user.id] ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSave(user.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleCancel(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      编辑
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserSettings;