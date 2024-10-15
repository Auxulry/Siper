import React from 'react';

interface TableHeader {
  label: string;
  width?: string;
}

interface TableProps {
  headers: TableHeader[];
  rows: React.ReactNode[][];
  isLoading?: boolean;
  emptyMessage?: string;
}

const Table: React.FC<TableProps> = ({ headers, rows, isLoading, emptyMessage = 'No data available' }) => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full border-collapse'>
        <thead>
          <tr className='bg-gray-100 text-left'>
            {headers.map((header, index) => (
              <th
                key={index}
                className='p-3'
                style={{ width: header.width || 'auto' }}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={headers.length} className='p-3 text-center'>
              Loading...
              </td>
            </tr>
          ) : rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className='border-b border-gray-200 hover:bg-gray-50'
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className='p-3 truncate'
                    style={{ maxWidth: headers[cellIndex]?.width || 'auto' }}
                  >
                    <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
                      {cell}
                    </div>
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className='p-3 text-center'>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
