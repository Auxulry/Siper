import { Schema } from 'mongoose';
import { RentDeclaration } from '@/types/rent';

export const RentSchema = new Schema<RentDeclaration.RentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId, // Change to ObjectId
      ref: 'User', // Reference the User model
      required: [true, 'User is required'],
    },
    bookId: {
      type: Schema.Types.ObjectId, // Change to ObjectId
      ref: 'Book', // Reference the Book model
      required: [true, 'Book is required'],
    },
    startRent: {
      type: Date,
      required: [true, 'Start Rent is required'],
    },
    endRent: {
      type: Date,
      required: [true, 'End Rent is required'],
    },
    status: {
      type: Number,
      required: [true, 'Status is required'],
    },
  },
  {
    timestamps: true,
  }
);
