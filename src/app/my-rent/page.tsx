'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/molecules/navbar/Navbar';
import {changeStatusRent, getRentedBooks} from '@/servers/rent.action';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Define the book type
interface RentedBook {
  id: string;
  title: string;
  author: string;
  image: string;
  startDate: Date;
  endDate: Date;
  status: number; // 0: Request for Rent, 1: On Rent, 2: Request for Return, 3: Returned
}

const BookListComponent = () => {
  const [rentedBooks, setRentedBooks] = useState<RentedBook[]>([]);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchRentedBooks = async () => {
      if (!session?.data?.user?.id) return;

      const res = await getRentedBooks(session?.data?.user.id);
      if (res?.code === 200) {
        setRentedBooks(res.data as RentedBook[]);
      } else {
        console.error('Error fetching rented books:', res.message);
      }
    };

    if (session?.status === 'unauthenticated') {
      router.push('/authentication/login');
    } else {
      fetchRentedBooks();
    }
  }, [session, router]);

  const handleRequestReturn = async (bookId: string) => {
    const response = await changeStatusRent(bookId, 2);

    if (response.code === 200) {
      setRentedBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId ? { ...book, status: 2 } : book
        )
      );
    } else {
      console.error('Error requesting to return book:', response.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className='container mx-auto p-4'>
        <h1 className='text-2xl font-bold mb-4'>Rented Books</h1>
        <div className='bg-white shadow-md rounded-md p-4 flex flex-col gap-4'>
          {rentedBooks.map((book) => (
            <div
              key={book.id}
              className='border-b pb-4 mb-4 flex flex-row items-start gap-4'
            >
              {/* Book Image */}
              <img
                src={book.image}
                alt={book.title}
                className='w-28 h-auto rounded'
              />
              {/* Book Details */}
              <div className='flex-1'>
                <h2 className='text-md font-bold'>{book.title}</h2>
                <p className='text-sm text-blue-600'>{book.author}</p>
                <p className='text-sm text-gray-500'>
                  Start Date: {new Date(book.startDate).toLocaleDateString()}
                </p>
                <p className='text-sm text-gray-500'>
                  End Date: {new Date(book.endDate).toLocaleDateString()}
                </p>
                <p
                  className={`text-sm mt-2 ${
                    book.status === 1
                      ? 'text-green-600'   // On Rent
                      : book.status === 3
                        ? 'text-gray-600'    // Returned
                        : book.status === 2
                          ? 'text-yellow-600' // Request for Return
                          : 'text-blue-600'   // Request for Rent
                  }`}
                >
                  Status: {book.status === 1 ? 'On Rent' : book.status === 3 ? 'Returned' : book.status === 2 ? 'Request for Return' : 'Request for Rent'}
                </p>
              </div>
              {/* Request to Return Button */}
              {book.status === 1 && ( // Show the button only if status is On Rent
                <button
                  className='bg-blue-600 text-white font-semibold py-2 px-4 rounded'
                  onClick={() => handleRequestReturn(book.id)}
                >
                  Request to Return
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default BookListComponent;
