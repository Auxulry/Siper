import React from 'react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className='flex justify-between items-center mt-4'>
      <div className='flex space-x-2'>
        <button
          className='p-2 bg-gray-200 rounded text-sm'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded text-sm ${
              currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className='p-2 bg-gray-200 rounded text-sm'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
