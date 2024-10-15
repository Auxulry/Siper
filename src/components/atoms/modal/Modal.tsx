import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  className?: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, className, children, ...rest }) => {
  if (!isOpen) return null;

  const classes = className
    ? `relative p-6 bg-white rounded-lg shadow-lg ${className}`
    : 'relative p-6 bg-white rounded-lg shadow-lg';

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      {...rest}
    >
      <div className={classes}>
        {/* Close button */}
        <button
          className='absolute top-2 right-2 text-gray-600 hover:text-gray-900'
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        {/* Modal content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
