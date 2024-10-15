import React, { useState, useEffect } from 'react';
import { listBooks } from '@/servers/book.action';
import { BookDeclaration } from '@/types/book';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Table from '@/components/atoms/table/Table';
import TablePagination from '@/components/atoms/table/TablePagination';
import SelectField from '@/components/atoms/select/SelectField';
import Modal from '@/components/atoms/modal/Modal';

interface BookTableProps {
  setValue: (e: BookDeclaration.BookDocument) => void;
  onDelete: (id: string) => void;
  revalidate: boolean;
}

const BooksTable: React.FC<BookTableProps> = ({ setValue, onDelete, revalidate }) => {
  const [books, setBooks] = useState<BookDeclaration.BookDocument[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: '0', label: 'Fiction' },
    { value: '1', label: 'Non-Fiction' },
    { value: '2', label: 'Science' },
    { value: '3', label: 'History' },
  ];

  useEffect(() => {
    fetchBooks(page, searchTerm, selectedCategory);
  }, [page, searchTerm, selectedCategory, revalidate]);

  const fetchBooks = async (page: number, search: string, category: string) => {
    setIsLoading(true);
    const res = await listBooks(page, limit, search, category);
    setIsLoading(false);

    if (res.code === 200) {
      setBooks(res.data || []);
      setTotalPages(res?.pagination?.totalPages || 0);
      setTotalBooks(res?.pagination?.total || 0);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleDeleteClick = (id: string) => {
    setBookToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (bookToDelete) {
      onDelete(bookToDelete);
    }
    setIsModalOpen(false);
  };

  const headers = [
    { label: 'Title', width: '300px' },
    { label: 'Author' },
    { label: 'Category' },
    { label: 'Pages' },
    { label: 'Publisher' },
    { label: 'Published Date' },
    { label: 'Language' },
    { label: 'Actions' },
  ];

  const getCategory = (category: number) => {
    switch (category){
      case 0:
        return 'Fiction';
      case 1:
        return 'Non-Fiction';
      case 2:
        return 'Science';
      default:
        return 'History';
    }
  };

  const rows = books.map((book) => [
    <span key={`title-${book._id}`} className='text-xs'>{book.title}</span>,
    <span key={`author-${book._id}`} className='text-xs'>{book.author}</span>,
    <span key={`category-${book._id}`} className='text-xs'>{getCategory(book.category)}</span>,
    <span key={`pages-${book._id}`} className='text-xs'>{book.pages}</span>,
    <span key={`publisher-${book._id}`} className='text-xs'>{book.publisher}</span>,
    <span key={`publishedDate-${book._id}`} className='text-xs'>{new Date(book.publishedAt).toLocaleDateString()}</span>,
    <span key={`language-${book._id}`} className='text-xs'>{book.language}</span>,
    <div key={`action-${book._id}`} className='flex space-x-2'>
      <button onClick={() => setValue(book)} className='text-blue-600 hover:text-blue-800'>
        <FaEdit />
      </button>
      <button onClick={() => handleDeleteClick(book._id)} className='text-red-600 hover:text-red-800'>
        <FaTrash />
      </button>
    </div>,
  ]);

  return (
    <div>
      <div className='flex mb-4 w-4/5'>
        <input
          type='text'
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder='Search by Title or Author'
          className='border rounded p-2 mr-2 w-full mb-4'
        />
        <SelectField
          name='category'
          value={selectedCategory}
          options={categoryOptions}
          onChange={handleCategoryChange}
        />
      </div>

      <Table headers={headers} rows={rows} isLoading={isLoading} />

      <div className='flex flex-row items-center justify-between mt-4'>
        <div className='text-sm mt-2'>
          Showing {books.length} of {totalBooks} Books
        </div>

        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>


      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className='text-lg font-bold'>Confirm Deletion</h2>
        <p className='mt-2'>Are you sure you want to delete this book?</p>
        <div className='flex justify-end mt-4'>
          <button onClick={() => setIsModalOpen(false)} className='mr-2 text-gray-600 hover:text-gray-900'>
            Cancel
          </button>
          <button onClick={confirmDelete} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BooksTable;
