import React from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

interface FormItemProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormItem: React.FC<FormItemProps> = ({
  label,
  error,
  required,
  children,
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {required && (
            <span className="text-red-500 mr-1">*</span>
          )}
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

const Form: React.FC<FormProps> = ({
  children,
  layout = 'vertical',
  className = '',
  ...props
}) => {
  const layouts = {
    vertical: '',
    horizontal: 'grid grid-cols-12 gap-4'
  };

  return (
    <form className={`${layouts[layout]} ${className}`} {...props}>
      {children}
    </form>
  );
};

export default Form;