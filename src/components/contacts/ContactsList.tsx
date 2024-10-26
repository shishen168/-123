import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, Phone, MessageSquare, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { contactsAPI } from '../../services/api';
import ContactForm, { ContactFormData } from './ContactForm';
import { tagAPI } from '../../services/api';
import useMediaQuery from '../../hooks/useMediaQuery';

function ContactsList() {
  // ... 保持现有状态管理代码 ...
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <h2 className="text-xl font-semibold">联系人管理</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowBlacklist(true)}
              className="flex items-center px-3 py-1.5 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
            >
              <Ban className="w-4 h-4 mr-1" />
              {!isMobile && "黑名单管理"}
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              {!isMobile && "添加联系人"}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索联系人..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {/* 标签过滤器 - 在移动端使用横向滚动 */}
            <div className="w-full md:w-auto overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
              <div className="inline-flex space-x-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.id)}
                    className={`
                      inline-flex items-center px-3 py-1.5 rounded-full text-sm
                      ${selectedTag === tag.id
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    <Tag className="w-4 h-4 mr-1" />
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 联系人列表 - 在移动端使用卡片式布局 */}
        <div className={`
          grid gap-4
          ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}
        `}>
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">{contact.name}</h3>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleSendSMS(contact)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(contact)}
                    className="p-2 text-gray-400 hover:text-green-600"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {contact.group && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    <Tag className="w-3 h-3 mr-1" />
                    {contact.group}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              暂无联系人
            </h3>
            <p className="text-gray-500">
              点击"添加联系人"按钮创建新的联系人
            </p>
          </div>
        )}
      </div>

      {/* 保持现有的模态框代码 */}
    </div>
  );
}

export default ContactsList;