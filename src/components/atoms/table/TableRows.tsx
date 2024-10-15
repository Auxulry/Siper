import React from 'react';

interface TableRowsProps {
  rows: React.ReactNode[][];
}

const TableRows: React.FC<TableRowsProps> = ({ rows }) => {
  return (
    <>
      {rows.map((row, rowIndex) => (
        <tr key={rowIndex} className='hover:bg-gray-50'>
          {row.map((cell, cellIndex) => (
            <td key={cellIndex} className='p-2'>{cell}</td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableRows;
