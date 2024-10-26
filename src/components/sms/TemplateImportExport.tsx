import React, { useState } from 'react';
import { Upload, Download, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { saveAs } from 'file-saver';

interface Template {
  id: string;
  name: string;
  content: string;
}

interface TemplateImportExportProps {
  templates: Template[];
  onImport: (templates: Omit<Template, 'id'>[]) => void;
}

function TemplateImportExport({ templates, onImport }: TemplateImportExportProps) {
  const [error, setError] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/json': ['.json']
    },
    multiple: false,
    onDrop: async (files) => {
      try {
        const file = files[0];
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (Array.isArray(data) && data.every(item => item.name && item.content)) {
          onImport(data);
          setError('');
        } else {
          setError('无效的模板文件格式');
        }
      } catch (err) {
        setError('文件读取失败');
      }
    }
  });

  const handleExport = () => {
    const data = templates.map(({ name, content }) => ({ name, content }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json;charset=utf-8' 
    });
    saveAs(blob, `sms_templates_${new Date().toISOString().split('T')[0]}.json`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div {...getRootProps()} className="flex-1 mr-4">
          <input {...getInputProps()} />
          <button className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed rounded-lg hover:bg-gray-50">
            <Upload className="w-5 h-5 mr-2" />
            导入模板
          </button>
        </div>
        
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Download className="w-5 h-5 mr-2" />
          导出模板
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

export default TemplateImportExport;