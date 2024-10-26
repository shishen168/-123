import React, { memo } from 'react';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  onDrop: (acceptedFiles: File[]) => void;
}

const FileUploader = memo(({ onDrop }: FileUploaderProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt', '.csv'],
    },
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`flex-1 flex items-center justify-center px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        {isDragActive ? (
          <p className="text-sm text-gray-600">拖放文件到这里</p>
        ) : (
          <div>
            <p className="text-sm text-gray-600">拖放文件到这里或点击上传</p>
            <p className="text-xs text-gray-500 mt-1">支持 .txt, .csv 文件</p>
          </div>
        )}
      </div>
    </div>
  );
});

FileUploader.displayName = 'FileUploader';

export default FileUploader;