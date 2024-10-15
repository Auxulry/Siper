import {Schema} from 'mongoose';

export declare namespace RentDeclaration {
  interface RentDocument {
    _id: string;
    userId: Schema.Types.ObjectId;
    bookId: Schema.Types.ObjectId;
    startRent: Date;
    endRent: Date;
    status: number;
    createdAt: Date;
    updatedAt: Date;
  }

  type RentPayload = {
    userId: string;
    bookId: string;
    startRent: Date;
    endRent: Date;
    status: number;
  }

  type RentItem = {
    _id: string;
    bookId: string;
    userId: string;
    bookName: string;
    userName: string;
    userEmail: string;
    startRent: Date;
    endRent: Date;
    status: number;
  }
}
