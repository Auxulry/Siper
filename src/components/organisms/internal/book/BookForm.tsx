'use client';

import React, { useEffect, useState } from 'react';
import TextField from '@/components/atoms/text-field/TextField';
import DatePickerField from '@/components/atoms/picker/DatePickerField';
import useValidator from '@/hooks/validator';
import * as joi from 'joi';
import { DOMDeclaration } from '@/types/commons/dom';
import { AlertDeclaration } from '@/types/components/alert';
import {createBook, getBookById, updateBook} from '@/servers/book.action';
import { BookDeclaration } from '@/types/book';
import Modal from '@/components/atoms/modal/Modal';
import SelectField from '@/components/atoms/select/SelectField';
import TextArea from '@/components/atoms/text-area/TextArea';

interface BookPayload {
  title: string;
  author: string;
  category: number;
  description: string;
  pages: number;
  publisher: string;
  publishedAt: Date | null;
  language: string;
  image: File | null;
}

interface BookFormProps {
  recentValue: BookDeclaration.BookDocument;
  isShow: boolean;
  onClose: () => void; // New prop to handle form close
  setAlert: (data: {
    type: AlertDeclaration.AlertType;
    message: string;
    open: boolean;
  }) => void;
  onRevalidate: (revalidate: boolean) => void;
}

const BookForm = ({ recentValue, onClose, isShow, setAlert, onRevalidate }: BookFormProps) => {
  const [formData, setFormData] = useState<BookPayload>({
    title: '',
    author: '',
    category: 0,
    description: '',
    pages: 0,
    publisher: '',
    publishedAt: null,
    language: '',
    image: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recentValue._id !== '') {
      setLoading(true);
      getBookById(recentValue._id).then((res) => {
        if (res.code === 200) {
          const data = res.data;
          setFormData({
            title: data?.title,
            author: data?.author,
            category: data?.category,
            description: data?.description,
            pages: data?.pages,
            publisher: data?.publisher,
            publishedAt: new Date(data?.publishedAt), // Corrected to publishedAt
            language: data?.language,
            image: null,
          });
          setLoading(false);
        }
      });
    }
  }, [recentValue._id]);

  const getSchema = (isEdit: boolean) => {
    if (!isEdit) {
      return joi.object<BookPayload>({
        title: joi.string().required().label('Title'),
        author: joi.string().required().label('Author'),
        category: joi.number().integer().required().label('Category'),
        description: joi.string().required().label('Description'),
        pages: joi.number().integer().positive().required().label('Pages'),
        publisher: joi.string().required().label('Publisher'),
        publishedAt: joi.date().required().label('Published Date'),
        language: joi.string().required().label('Language'),
        image: joi.any().required().label('Book Cover Image'), // Update for image validation
      });
    }

    return joi.object<BookPayload>({
      title: joi.string().required().label('Title'),
      author: joi.string().required().label('Author'),
      category: joi.number().integer().required().label('Category'),
      description: joi.string().required().label('Description'),
      pages: joi.number().integer().positive().required().label('Pages'),
      publisher: joi.string().required().label('Publisher'),
      publishedAt: joi.date().required().label('Published Date'),
      language: joi.string().required().label('Language'),
      image: joi.any().label('Book Cover Image'), // Update for image validation
    });
  };

  const { errors, validate } = useValidator(getSchema(recentValue._id !== ''));

  const handleChange = (e: { target: DOMDeclaration.EventTarget }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({ ...formData, publishedAt: date });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate(formData)) {
      const formDataObj = new FormData();

      // Append each field to the FormData object
      formDataObj.append('title', formData.title);
      formDataObj.append('author', formData.author);
      formDataObj.append('description', formData.description);
      formDataObj.append('category', formData.category.toString());
      formDataObj.append('pages', formData.pages.toString());
      formDataObj.append('publisher', formData.publisher);
      formDataObj.append('publishedAt', formData?.publishedAt?.toISOString() || '');
      formDataObj.append('language', formData.language);

      if (formData.image) {
        formDataObj.append('image', formData.image as File);
      }

      let response;

      if (recentValue._id !== '') {
        response = await updateBook(recentValue._id, formDataObj);
      } else {
        // Create a new book
        response = await createBook(formDataObj);
      }

      if (response.code === 200 || response.code === 201) {
        setAlert({
          type: 'success',
          message: `Book ${recentValue._id !== '' ? 'updated' : 'created'} successfully!`,
          open: true,
        });
        setFormData({
          title: '',
          author: '',
          category: 0,
          description: '',
          pages: 0,
          publisher: '',
          publishedAt: null,
          language: '',
          image: null,
        });
        onClose();
      } else {
        setAlert({
          type: 'danger',
          message: response.message || `Failed to ${recentValue._id !== '' ? 'update' : 'save'} the book.`,
          open: true,
        });
      }

      onRevalidate(true);
    }
  };


  return (
    <Modal isOpen={isShow} onClose={onClose} className='w-1/2'>
      {loading && (
        <p className='text-md'>Loading...</p>
      )}

      {!loading && (
        <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <TextField
            label='Title'
            name='title'
            placeholder='Enter book title'
            value={formData.title}
            errors={errors.title}
            onChange={handleChange}
          />
          <TextField
            label='Author'
            name='author'
            placeholder='Enter author name'
            value={formData.author}
            errors={errors.author}
            onChange={handleChange}
          />
          <SelectField
            label='Category'
            name='category'
            value={formData.category}
            options={[
              {value: 0, label: 'Fiction'},
              {value: 1, label: 'Non-Fiction'},
              {value: 2, label: 'Science'},
              {value: 3, label: 'History'},
            ]}
            errors={errors.category}
            onChange={handleChange}
          />
          <TextField
            label='Pages'
            name='pages'
            type='number'
            placeholder='Enter number of pages'
            value={formData.pages}
            errors={errors.pages}
            onChange={handleChange}
          />
          <TextField
            label='Publisher'
            name='publisher'
            placeholder='Enter publisher name'
            value={formData.publisher}
            errors={errors.publisher}
            onChange={handleChange}
          />
          <DatePickerField
            label='Published At'
            selectedDate={formData.publishedAt}
            onChange={handleDateChange}
            placeholder='Published Date'
            errors={errors.publishedAt}
          />
          <TextField
            label='Language'
            name='language'
            placeholder='Enter language'
            value={formData.language}
            errors={errors.language}
            onChange={handleChange}
          />
          <div className='col-span-full'>
            <TextArea
              label='Description'
              name='description'
              placeholder='Enter description'
              value={formData.description}
              errors={errors.description}
              onChange={handleChange}
              height={400}
            />
          </div>
          <div className='col-span-full'>
            <label className='block text-sm font-medium text-gray-700'>Book Cover Image</label>
            <input
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              className='mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md'
              required={recentValue._id === ''}
            />
          </div>
          <div className='col-span-full'>
            <button
              type='submit'
              className='w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'
            >
              Save Book
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default BookForm;
