import React from 'react';
import {AlertDeclaration} from '@/types/components/alert';

const Alert: React.FC<AlertDeclaration.AlertProps> = ({ type, message, onClose }) => {
  const alertClasses = {
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    danger: 'bg-red-100 border-red-400 text-red-700',
  };

  return (
    <div className={`flex items-center p-4 mb-4 border-l-4 ${alertClasses[type]} rounded absolute top-5 right-5`} role='alert'>
      <div className='flex-grow'>
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className='ml-4 text-gray-600 hover:text-gray-800'
          aria-label='Close alert'
        >
          <span className='material-icons'>close</span>
        </button>
      )}
    </div>
  );
};

export default Alert;
