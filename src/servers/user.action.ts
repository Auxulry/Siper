'use server';

import { UserDeclaration } from '@/types/user';
import { connector } from '@/commons/database';
import UserEntity from '@/entities/user.entity';
import bcrypt from 'bcryptjs';
import { MongoError } from 'mongodb'; // Import MongoError to handle specific errors

export const register = async (payload: UserDeclaration.RegisterPayload) => {
  const { name, email, password, phone } = payload;

  try {
    await connector();

    const exists = await UserEntity.findOne({
      $or: [{ email }, { phone }],
    });

    if (exists) {
      const conflictField = exists.email === email ? 'email' : 'phone';
      return {
        code: 409,
        status: 'Conflict',
        message: `User already exists with this ${conflictField}!`,
      };
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10);
    const user = new UserEntity({
      name,
      email,
      password: hash,
      phone,
    });

    await user.save();

    return {
      code: 200,
      status: 'OK',
      message: 'Register successfully',
    };
  } catch (err) {
    if (err instanceof MongoError && err.code === 11000) {
      const field = err.message.includes('email') ? 'email' : 'phone';
      return {
        code: 409,
        status: 'Conflict',
        message: `User already exists with this ${field}!`,
      };
    }

    console.log(`Error: ${err}`);
    return {
      code: 500,
      status: 'Internal Server Error',
      message: 'Something went wrong',
    };
  }
};

export const listUsers = async (page = 1, limit = 10, searchTerm = '') => {
  try {
    await connector();

    const skip = (page - 1) * limit;

    const searchQuery = searchTerm ? {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }
      ]
    } : { isAdmin: false };

    const [users, total] = await Promise.all([
      UserEntity.find(searchQuery, { password: 0 })
        .skip(skip)
        .limit(limit),
      UserEntity.countDocuments(searchQuery),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      code: 200,
      status: 'OK',
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  } catch (err) {
    console.log(`Error: ${err}`);
    return {
      code: 500,
      status: 'Internal Server Error',
      message: 'Something went wrong',
    };
  }
};

export const getTotalUsers = async () => {
  try {
    await connector();
    return {
      code: 200,
      status: 'OK',
      data: await UserEntity.countDocuments({ isAdmin: false }),
    };
  } catch (err) {
    console.log(`Error: ${err}`);
    return {
      code: 500,
      status: 'Internal Server Error',
      message: 'Something went wrong',
    };
  }
};

