import React, { useState, useEffect } from 'react';
import { listRentedBooks, changeStatusRent } from '@/servers/rent.action';
import { RentDeclaration } from '@/types/rent';
import Table from '@/components/atoms/table/Table';
import TablePagination from '@/components/atoms/table/TablePagination';
import SelectField from '@/components/atoms/select/SelectField';

const RentedBooksTable: React.FC = () => {
  const [rentedBooks, setRentedBooks] = useState<RentDeclaration.RentItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRentedBooks, setTotalRentedBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: '0', label: 'Request for Rent' },
    { value: '1', label: 'On Rent' },
    { value: '2', label: 'Request for Return' },
    { value: '3', label: 'Returned' },
  ];

  useEffect(() => {
    fetchRentedBooks(page, searchTerm, selectedStatus);
  }, [page, searchTerm, selectedStatus]);

  const fetchRentedBooks = async (page: number, search: string, status: string) => {
    setIsLoading(true);
    const res = await listRentedBooks(page, limit, search, status);
    setIsLoading(false);

    if (res.code === 200) {
      setRentedBooks(res.data || []);
      setTotalPages(res?.pagination?.totalPages || 0);
      setTotalRentedBooks(res?.pagination?.total || 0);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return 'Request for Rent';
      case 1:
        return 'On Rent';
      case 2:
        return 'Request for Return';
      default:
        return 'Returned';
    }
  };

  const handleStatusUpdate = async (rentId: string, newStatus: number) => {
    const res = await changeStatusRent(rentId, newStatus);
    if (res.code === 200) {
      fetchRentedBooks(page, searchTerm, selectedStatus); // Update fetch to include filters
    } else {
      console.error('Failed to update status:', res.message);
    }
  };

  const headers = [
    { label: 'User' },
    { label: 'Book Name', width: '300px' },
    { label: 'Start Rent' },
    { label: 'End Rent' },
    { label: 'Status', width: '150px' },
    { label: 'Actions' }
  ];


  const rows = rentedBooks.map((rent) => [
    <span key={`user-${rent._id}`} className='text-sm'>{`${rent.userName} - (${rent.userEmail})`}</span>,
    <span
      key={`book-${rent._id}`}
      className='text-sm'
    >
      {rent.bookName}
    </span>,
    <span key={`startRent-${rent._id}`} className='text-xs'>{new Date(rent.startRent).toLocaleDateString()}</span>,
    <span key={`endRent-${rent._id}`} className='text-xs'>{new Date(rent.endRent).toLocaleDateString()}</span>,
    <span key={`status-${rent._id}`} className='text-xs'>{getStatusLabel(rent.status)}</span>,
    <div key={`action-${rent._id}`}>
      {rent.status === 0 && (
        <button
          onClick={() => handleStatusUpdate(rent._id, 1)}
          className='px-2 text-xs py-1 text-white bg-green-500 rounded hover:bg-green-700'
        >
          Approve Rent
        </button>
      )}
      {rent.status === 2 && (
        <button
          onClick={() => handleStatusUpdate(rent._id, 3)}
          className='px-2 text-xs py-1 text-white bg-blue-500 rounded hover:bg-blue-700'
        >
          Approve Return
        </button>
      )}
    </div>,
  ]);

  return (
    <div>
      <div className='flex mb-4 w-4/5'>
        <input
          type='text'
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder='Search by User or Book'
          className='border rounded p-2 mr-2 w-full mb-4'
        />
        <SelectField
          name='status'
          value={selectedStatus}
          options={statusOptions}
          onChange={handleStatusChange}
        />
      </div>

      <Table headers={headers} rows={rows} isLoading={isLoading} />

      <div className='flex flex-row items-center justify-between mt-4'>
        <div className='text-sm mt-2'>
          Showing {rentedBooks.length} of {totalRentedBooks} Rented Books
        </div>

        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default RentedBooksTable;
