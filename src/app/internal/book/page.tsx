'use client';

import AdminLayout from '@/components/layouts/AdminLayout';
import React, { useState } from 'react';
import BookTable from '@/components/organisms/internal/book/BookTable';
import BookForm from '@/components/organisms/internal/book/BookForm';
import {BookDeclaration} from '@/types/book';
import Alert from '@/components/atoms/alert/Alert';
import {AlertDeclaration} from '@/types/components/alert';
import {deleteBook} from '@/servers/book.action';

export default function AdminBook() {
  const [showForm, setShowForm] = useState(false);
  const [value, setValue] = useState<BookDeclaration.BookDocument>({
    _id: '',
    title: '',
    slug: '',
    image: '',
    author: '',
    description: '',
    category: 0,
    pages: 0,
    publisher: '',
    publishedAt: new Date(),
    language: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false
  });

  const [revalidate, setRevalidate] = useState(false);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const handleSetParams = (e: BookDeclaration.BookDocument) => {
    setValue(e);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteBook(id);

    if (res.code === 200) {
      handleSetAlert({
        type: 'success',
        message: res.message,
        open: true,
      });
    } else {
      handleSetAlert({
        type: 'danger',
        message: res.message,
        open: true,
      });
    }

    setRevalidate(true);
  };

  const [alert, setAlert] = useState<{
    type: AlertDeclaration.AlertType;
    message: string;
    open: boolean;
  }>({
    type: 'success',
    message: '',
    open: false,
  });

  const handleSetAlert = (data: {
    type: AlertDeclaration.AlertType;
    message: string;
    open: boolean;
  }) => {
    setAlert(data);
  };

  return (
    <AdminLayout>
      <div className='container mx-auto p-4 relative'>
        {alert.open && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert((prev) => ({
              ...prev,
              open: false,
            }))}
          />
        )}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold'>Manage Books</h1>
        </div>

        <button
          onClick={toggleForm}
          className='mb-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'
        >
          {showForm ? 'Cancel' : 'Create Book'}
        </button>
        <BookForm onClose={toggleForm} recentValue={value} isShow={showForm} setAlert={handleSetAlert} onRevalidate={(e) => setRevalidate(e)} />
        <BookTable setValue={handleSetParams} onDelete={handleDelete} revalidate={revalidate} />
      </div>
    </AdminLayout>
  );
}
