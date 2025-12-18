import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  helperText, 
  icon,
  containerClassName = '',
  className = '', 
  type = 'text',
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = props.id || label?.toLowerCase().replace(/\s+/g, '-');
  
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          type={inputType}
          className={`
            w-full px-4 py-3 border rounded-lg 
            focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
            transition-all duration-200
            placeholder:text-gray-400
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${icon ? 'pl-11' : 'pl-4'}
            ${isPasswordField ? 'pr-11' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${className}
          `}
          {...props}
        />
        
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <svg 
            className="w-4 h-4 mr-1" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;