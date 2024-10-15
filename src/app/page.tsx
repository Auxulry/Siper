'use client';

import React, {useEffect, useState} from 'react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import {MdArrowForward, MdArrowBack} from 'react-icons/md';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/molecules/navbar/Navbar';
import {allBooks, bookSeed} from '@/servers/book.action';
import {BookDeclaration} from '@/types/book';

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


const NavigationButtons = () => {
  const swiper = useSwiper();

  return (
    <div className='justify-between absolute top-[45%] hidden md:flex left-0 right-0 z-20'>
      <button
        className='flex items-center justify-center p-6 rounded-full bg-blue-500 text-white hover:bg-blue-600 -translate-x-6'
        onClick={() => swiper.slidePrev()}
      >
        <MdArrowBack />
      </button>
      <button
        className='flex items-center justify-center p-6 rounded-full bg-blue-500 text-white hover:bg-blue-600 translate-x-6'
        onClick={() => swiper.slideNext()}
      >
        <MdArrowForward />
      </button>
    </div>
  );
};

export default function Home() {
  const [filter, setFilter] = useState({q: '', category: ''});
  const router = useRouter();
  const [books, setBooks] = useState<BookDeclaration.BookDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    router.push(`result?q=${filter.q}&category=${filter.category}`);
  };


  const handleDetail = (slug: string) => {
    router.push(`/books/${slug}`);
  };

  useEffect(() => {
    bookSeed().catch((error) => {
      console.error('Seeding failed:', error);
    });

    allBooks('', '').then((res) => {

      if (res.code === 200) {
        setBooks(res.data as BookDeclaration.BookDocument[]);
      }

      setLoading(false);
    });
  }, []);

  return (
    <>
      <Navbar />
      <main className='container mx-auto p-4'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Let&#39;s find your next read</h1>

        {/* Filter Inputs */}
        <div className='mb-4 md:flex hidden items-center'>
          <input
            type='text'
            name='q'
            placeholder='Search by title or author'
            value={filter.q}
            onChange={handleChange}
            className='border rounded p-2 mr-2'
          />
          <select
            name='category'
            value={filter.category}
            onChange={handleChange}
            className='border rounded p-2 mr-2'
          >
            <option value=''>All Categories</option>
            <option value='0'>Fiction</option>
            <option value='1'>Non-Fiction</option>
            <option value='2'>Science</option>
            <option value='3'>History</option>
          </select>
          <button
            className='bg-blue-500 text-white rounded p-2 hover:bg-blue-600'
            onClick={() => handleSearch()}
          >
            Search
          </button>
        </div>

        {/* Mobile Filter Inputs */}
        <div className='mb-4 md:hidden flex flex-col w-full items-start'>
          <input
            type='text'
            name='query'
            placeholder='Search by title or author'
            value={filter.q}
            onChange={handleChange}
            className='border rounded p-2 mb-2 w-full'
          />
          <select
            name='category'
            value={filter.category}
            onChange={handleChange}
            className='border rounded p-2 mb-2 w-full'
          >
            <option value=''>All Categories</option>
            <option value='Fiction'>Fiction</option>
            <option value='Non-Fiction'>Non-Fiction</option>
            <option value='Science'>Science</option>
            <option value='History'>History</option>
          </select>
          <button
            className='bg-blue-500 text-white rounded p-2 hover:bg-blue-600 w-full'
            onClick={() => handleSearch()}
          >
            Search
          </button>
        </div>

        <section className='mb-10 relative'>
          <h2 className='text-xl font-semibold mb-4'>Latest Books</h2>
          {loading
            ? (
              <div className='flex flex-row gap-2'>
                {Array.from({length: 5}).map((_, index) => (
                  <SkeletonLoader key={index}/>
                ))}
              </div>
            )
            : (
              <Swiper
                modules={[Navigation]}
                spaceBetween={10}
                slidesPerView={2}
                navigation
                pagination={{clickable: true}}
                breakpoints={{
                  640: {slidesPerView: 3},
                  768: {slidesPerView: 4},
                  1024: {slidesPerView: 5},
                }}
              >
                {books.map((book, index) => (
                  <SwiperSlide key={index}>
                    <div className='bg-gray-200 rounded-lg overflow-hidden shadow-md cursor-pointer'
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
                  </SwiperSlide>
                ))}
                <NavigationButtons/>
              </Swiper>
            )
          }
        </section>
        <div className='mb-10'>
          <h2 className='text-xl font-semibold mb-4'>Books by Category</h2>
          {['Fiction', 'Non-Fiction', 'Science', 'History'].map((category, index) => (
            <section key={index} className='mb-4 relative'>
              <h3 className='text-lg font-semibold'>{category}</h3>
              {loading
                ? (
                  <div className='flex flex-row gap-2'>
                    {Array.from({length: 5}).map((_, index) => (
                      <SkeletonLoader key={index}/>
                    ))}
                  </div>
                )
                : (
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={10}
                    slidesPerView={2}
                    navigation
                    pagination={{clickable: true}}
                    breakpoints={{
                      640: {slidesPerView: 3},
                      768: {slidesPerView: 4},
                      1024: {slidesPerView: 5},
                    }}
                  >
                    {books.filter(book => book.category === index).map((book, bookIndex) => (
                      <SwiperSlide key={bookIndex}>
                        <div className='bg-gray-200 rounded-lg overflow-hidden shadow-md cursor-pointer'
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
                      </SwiperSlide>
                    ))}
                    {books.filter(book => book.category === index).length > 5 && (
                      <NavigationButtons/>
                    )}
                  </Swiper>
                )
              }
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
