import mongoose, {model} from 'mongoose';
import {BookSchema} from '@/schemas/book.schema';
import {BookDeclaration} from '@/types/book';

const BookEntity = mongoose.models?.Book || model<BookDeclaration.BookDocument>(
  'Book',
  BookSchema
);

export default BookEntity;
