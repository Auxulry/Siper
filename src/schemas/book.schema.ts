import { Schema } from 'mongoose';
import { BookDeclaration } from '@/types/book';

export const BookSchema = new Schema<BookDeclaration.BookDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    slug: {
      type: String,
      unique: true,
      required: [true, 'Slug is required'],
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
    },
    description: {
      type: String,
      unique: true,
      required: [true, 'Description is required'],
    },
    category: {
      type: Number,
      required: [true, 'Category is required'],
    },
    pages: {
      type: Number,
      required: [true, 'Pages are required'],
    },
    publisher: {
      type: String,
      required: [true, 'Publisher is required'],
    },
    publishedAt: {
      type: Date,
      required: [true, 'Published At is required']
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
    },
    deleted: { // Add this field for soft delete
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
