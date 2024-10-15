import {Schema} from 'mongoose';
import {UserDeclaration} from '@/types/user';

export const UserSchema = new Schema<UserDeclaration.UserDocument>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email is invalid',
      ],
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    phone: {
      type: String,
      unique: true,
      required: [true, 'Phone is required'],
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);
