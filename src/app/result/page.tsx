'use client';

import React, {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import Navbar from '@/components/molecules/navbar/Navbar';
import {BookDeclaration} from '@/types/book';
import {allBooks} from '@/servers/book.action';

const SkeletonLoader: React.FC = () => {
  return (
    <div className='bg-gray-200 animate-pulse rounded-lg shadow-md w-[241px] h-[441px]'>
      <div className='w-full' style={{ paddingBottom: '149.53%' }}>
        <div className='h-full bg-gray-300 rounded-lg'></div>
      </div>
      <div className='p-4'>
        <div className='h-4 bg-gray-300 rounded w-3/4 mb-2'></div>
        <div className='h-4 bg-gray-300 rounded w-1/2'></div>
      </div>
    </div>
  );
};

const Results = () => {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<BookDeclaration.BookDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleDetail = (slug: string) => {
    router.push(`/books/${slug}`);
  };


  useEffect(() => {
    const query = ((searchParams.get('q') || '') as string).toLowerCase();
    const category = ((searchParams.get('category') || '') as string).toLowerCase();

    allBooks(query, category).then((res) => {
      if (res.code === 200) {
        setBooks(res.data as BookDeclaration.BookDocument[]);
      }

      setLoading(false);
    });
  }, [searchParams]);

  return (
    <>
      <Navbar/>
      <main className='container mx-auto p-4'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Search Results</h1>
        <section className='grid grid-cols-2 md:grid-cols-5 gap-4'>
          {loading && (
            Array.from({length: 5}).map((_, index) => (
              <SkeletonLoader key={index}/>
            ))
          ) }
          {books.length > 0 && !loading && (
            books.map((book, index) => (
              <div key={index} className='bg-gray-200 rounded-lg overflow-hidden shadow-md cursor-pointer'
                onClick={() => handleDetail(book.slug)}>
                <div className='relative w-full' style={{paddingBottom: '149.53%'}}>
                  <img
                    src={book.image}
                    alt={book.title}
                    className='absolute top-0 left-0 w-full h-full object-cover'
                  />
                </div>
                <div className='p-4'>
                  <h3 className='text-lg font-semibold overflow-hidden whitespace-nowrap text-ellipsis'
                    title={book.title}>
                    {book.title}
                  </h3>
                  <p className='text-sm text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis'
                    title={book.author}>
                    {book.author}
                  </p>
                </div>
              </div>
            ))
          )}
          {books.length === 0 && !loading && (
            <p>No results found.</p>
          )}
        </section>
      </main>
    </>
  );
};

export default Results;
