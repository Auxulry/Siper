import React, { useState, useEffect } from 'react';
import { listUsers } from '@/servers/user.action'; // Assuming these actions are defined
import Table from '@/components/atoms/table/Table';
import TablePagination from '@/components/atoms/table/TablePagination';
import {UserDeclaration} from '@/types/user';

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<UserDeclaration.UserDocument[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers(page, searchTerm);
  }, [page, searchTerm]);

  const fetchUsers = async (page: number, search: string) => {
    setIsLoading(true);
    const res = await listUsers(page, limit, search);
    setIsLoading(false);

    if (res.code === 200) {
      setUsers(res.data || []);
      setTotalPages(res?.pagination?.totalPages || 0);
      setTotalUsers(res?.pagination?.total || 0);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const headers = [
    { label: 'User Name', width: '200px' },
    { label: 'Email', width: '250px' },
    { label: 'Phone', width: '200px' },
    { label: 'Created At', width: '150px' }
  ];

  const rows = users.map((user) => [
    <span key={`userName-${user._id}`} className='text-sm'>{user.name}</span>,
    <span key={`email-${user._id}`} className='text-sm'>{user.email}</span>,
    <span key={`phone-${user._id}`} className='text-sm'>{user.phone}</span>,
    <span key={`created-${user._id}`} className='text-sm'>{new Date(user.createdAt).toLocaleDateString()}</span>,
  ]);

  return (
    <div>
      <div className='flex mb-4 w-4/5'>
        <input
          type='text'
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder='Search by User Name or Email'
          className='border rounded p-2 mr-2 w-full mb-4'
        />
      </div>

      <Table headers={headers} rows={rows} isLoading={isLoading} />

      <div className='flex flex-row items-center justify-between mt-4'>
        <div className='text-sm mt-2'>
          Showing {users.length} of {totalUsers} Users
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

export default UsersTable;
