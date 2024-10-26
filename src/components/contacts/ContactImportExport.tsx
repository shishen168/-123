import React, { useState } from 'react';
import { Upload, Download, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { Contact } from '../../types';

interface ContactImportExportProps {
  onImport: (contacts: Contact[]) => void;
  contacts: Contact[];
}

function ContactImportExport({ onImport, contacts }: ContactImportExportProps) {
  const [error, setError] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls', '.xlsx']
    },
    multiple: false,
    onDrop: async (files) => {
      try {
        const file = files[0];
        const text = await file.text();
        
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            const validContacts = results.data
              .filter(row => row.name && row.phone)
              .map(row => ({
                id: Date.now().toString(),
                name: row.name,
                phone: row.phone,
                email: row.email || '',
                group: row.group || '',
                notes: row.notes || ''
              }));

            if (validContacts.length > 0) {
              onImport(validContacts);
              setError('');
            } else {
              setError('没有找到有效的联系人数据');
            }
          },
          error: (error) => {
            setError(`导入失败: ${error.message}`);
          }
        });
      } catch (err) {
        setError('文件读取失败');
      }
    }
  });

  const handleExport = () => {
    const csv = Papa.unparse(contacts.map(contact => ({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || '',
      group: contact.group || '',
      notes: contact.notes || ''
    })));

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `contacts_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div {...getRootProps()} className="flex-1 mr-4">
          <input {...getInputProps()} />
          <button className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed rounded-lg hover:bg-gray-50">
            <Upload className="w-5 h-5 mr-2" />
            导入联系人
          </button>
        </div>
        
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Download className="w-5 h-5 mr-2" />
          导出联系人
        </button>
      </div>

      {error && (
        <div className="flex items-center p-4 bg-red-50 rounded-lg text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
    </div>
  );
}

export default ContactImportExport;