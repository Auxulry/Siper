'use client';

import AdminLayout from '@/components/layouts/AdminLayout';
import React from 'react';
import UserTable from '@/components/organisms/internal/user/UserTable';

export default function AdminBook() {
  return (
    <AdminLayout>
      <div className='container mx-auto p-4'>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold'>Manage Users</h1>
        </div>

        <UserTable />
      </div>
    </AdminLayout>
  );
}
