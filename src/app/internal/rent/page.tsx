'use client';

import AdminLayout from '@/components/layouts/AdminLayout';
import React from 'react';
import RentTable from '@/components/organisms/internal/rent/RentTable';

export default function AdminBook() {
  return (
    <AdminLayout>
      <div className='container mx-auto p-4'>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold'>Manage Rented Book</h1>
        </div>

        <RentTable />
      </div>
    </AdminLayout>
  );
}
