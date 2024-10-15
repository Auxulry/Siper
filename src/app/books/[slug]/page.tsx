'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/molecules/navbar/Navbar';
import DatePickerField from '@/components/atoms/picker/DatePickerField';
import { findBookBySlug } from '@/servers/book.action';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import * as joi from 'joi';
import useValidator from '@/hooks/validator';
import {useRouter} from 'next/navigation';
import {rentBook} from '@/servers/rent.action';
import {AlertDeclaration} from '@/types/components/alert';
import Alert from '@/components/atoms/alert/Alert';

interface Book {
  _id: string;
  title: string;
  slug: string;
  image: string;
  author: string;
  description: string;
  category: number;
  pages: number;
  publisher: string;
  publishedAt: string;
  language: string;
}

const schema = joi.object({
  startDate: joi.date().required().label('Start Date'),
  endDate: joi.date().greater(joi.ref('startDate')).required().label('End Date'),
});

const BookRentComponent = ({ params }: { params: { slug: string } }) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const session = useSession();
  const { errors, validate } = useValidator(schema);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    console.log(session.data?.user);
  }, [session]);

  useEffect(() => {
    const fetchBook = async () => {
      if (params.slug) {
        try {
          const res = await findBookBySlug(params.slug as string);
          const formattedBook = {
            ...res.data,
            publishedAt: dayjs(res.data.publishedAt).format('MMMM DD'),
          };
          setBook(formattedBook);
        } catch (err) {
          console.log(`Error: ${err}`);
          setError('Error fetching book details. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBook();
  }, [params]);

  const [alert, setAlert] = useState<{
    type: AlertDeclaration.AlertType,
    message: string;
    open: boolean;
  }>({
    type: 'success',
    message: 'success',
    open: false
  });

  const handleRent = async () => {
    if (session.status === 'unauthenticated') {
      router.push('/authentication/login');
    }
    const formData = {
      startDate: selectedStartDate,
      endDate: selectedEndDate,
    };

    if (validate(formData)) {
      const res = await rentBook({
        userId: session?.data?.user.id || '',
        bookId: book?._id || '',
        startRent: selectedStartDate as Date,
        endRent: selectedEndDate as Date,
        status: 0
      });

      if (res?.code !== 200) {
        setAlert({
          type: 'danger',
          message: res.message,
          open: true,
        });
      } else {
        setAlert({
          type: 'success',
          message: res.message,
          open: true,
        });

        router.push('/my-rent');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className='text-red-600'>{error}</div>;
  }

  if (!book) {
    return <div>No book found.</div>;
  }

  return (
    <>
      <Navbar />
      <main className='container mx-auto p-4 relative'>
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
        <div className='bg-white shadow-md rounded-md p-4 flex flex-col gap-4'>
          {/* Book Image */}
          <div className='flex flex-row items-start gap-2'>
            <img
              src={book.image}
              alt={book.title}
              className='w-28 h-auto rounded'
            />
            {/* Book Details */}
            <div className='flex-1'>
              <h2 className='text-md font-bold'>
                {book.title}
              </h2>
              <p className='text-sm text-blue-600'>{book.author}</p>
              <p className='text-sm text-gray-500'>{book.publishedAt} • {book.publisher}</p>
              <p className='text-sm text-gray-500'>{book.pages} Halaman</p>
            </div>
          </div>

          {/* Book Description */}
          <div className={`text-sm ${isExpanded ? '' : 'line-clamp-4'} text-gray-700`}>
            {book.description}
          </div>

          {/* Read More Button */}
          <button
            className='text-blue-600 text-sm mt-2 focus:outline-none'
            onClick={toggleReadMore}
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>

          {/* Rent Button and Date Picker */}
          <div className='flex flex-col gap-4'>
            <DatePickerField
              selectedDate={selectedStartDate}
              onChange={(date) => setSelectedStartDate(date)}
              placeholder='Start Date'
            />
            {errors.startDate && <div className='text-red-600'>{errors.startDate}</div>}
            <DatePickerField
              selectedDate={selectedEndDate}
              onChange={(date) => setSelectedEndDate(date)}
              placeholder='End Date'
            />
            {errors.endDate && <div className='text-red-600'>{errors.endDate}</div>}
            <button
              className='bg-blue-600 text-white font-semibold py-2 rounded w-full'
              onClick={handleRent}
            >
              Rent
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default BookRentComponent;
