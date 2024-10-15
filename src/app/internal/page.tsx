'use client';

import AdminLayout from '@/components/layouts/AdminLayout';
import {useEffect, useState} from 'react';
import {bookSeed, getTotalBooks} from '@/servers/book.action';
import {MdPerson} from 'react-icons/md';
import {IoBook, IoBookOutline, IoReturnDownBack} from 'react-icons/io5';
import {getTotalUsers} from '@/servers/user.action';
import {getTotalRentByStatus} from '@/servers/rent.action';

export default function AdminHome() {
  const [widget, setWidget] = useState<{
    users: number;
    books: number;
    rent: number;
    returned: number;
  }>({
    users: 0,
    books: 0,
    rent: 0,
    returned: 0,
  });

  useEffect(() => {
    bookSeed().catch((error) => {
      console.error('Seeding failed:', error);
    });

    getTotalUsers().then((res) => {
      if (res.code === 200) {
        setWidget((prev) => ({
          ...prev,
          users: res?.data || 0
        }));
      }
    });

    getTotalBooks().then((res) => {
      if (res.code === 200) {
        setWidget((prev) => ({
          ...prev,
          books: res?.data || 0
        }));
      }
    });

    getTotalRentByStatus(1).then((res) => {
      if (res.code === 200) {
        setWidget((prev) => ({
          ...prev,
          rent: res?.data || 0
        }));
      }
    });

    getTotalRentByStatus(3).then((res) => {
      if (res.code === 200) {
        setWidget((prev) => ({
          ...prev,
          returned: res?.data || 0
        }));
      }
    });

  }, []);

  return (
    <AdminLayout>
      <div className='container'>
        <div className='flex flex-row gap-4 items-center'>
          <div className='flex flex-col items-center w-full bg-white shadow-lg rounded px-4 py-8 gap-2'>
            <div className='flex flex-col gap-2 items-center'>
              <div className='p-2 rounded-lg bg-blue-200'>
                <MdPerson size={28} className='text-blue-500'/>
              </div>
              <h1 className='text-md font-bold'>Total Users</h1>
            </div>
            <h4 className='text-xl'>{widget.users}</h4>
          </div>
          <div className='flex flex-col items-center w-full bg-white shadow-lg rounded px-4 py-8 gap-2'>
            <div className='flex flex-col gap-2 items-center'>
              <div className='p-2 rounded-lg bg-green-200'>
                <IoBook size={28} className='text-green-500'/>
              </div>
              <h1 className='text-md font-bold'>Total Books</h1>
            </div>
            <h4 className='text-xl'>{widget.books}</h4>
          </div>
          <div className='flex flex-col items-center w-full bg-white shadow-lg rounded px-4 py-8 gap-2'>
            <div className='flex flex-col gap-2 items-center'>
              <div className='p-2 rounded-lg bg-yellow-200'>
                <IoBookOutline size={28} className='text-yellow-500'/>
              </div>
              <h1 className='text-md font-bold'>Total Books on Rent</h1>
            </div>
            <h4 className='text-xl'>{widget.rent}</h4>
          </div>
          <div className='flex flex-col items-center w-full bg-white shadow-lg rounded px-4 py-8 gap-2'>
            <div className='flex flex-col gap-2 items-center'>
              <div className='p-2 rounded-lg bg-red-200'>
                <IoReturnDownBack size={28} className='text-red-500'/>
              </div>
              <h1 className='text-md font-bold'>Total Books on Return</h1>
            </div>
            <h4 className='text-xl'>{widget.returned}</h4>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
