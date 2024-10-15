'use server';

import { connector } from '@/commons/database';
import RentEntity from '@/entities/rent.entity';
import {RentDeclaration} from '@/types/rent';
import BookEntity from '@/entities/book.entity';

export const rentBook = async (payload: RentDeclaration.RentPayload) => {
  try {
    await connector();

    const rent = new RentEntity({
      userId: payload.userId,
      bookId: payload.bookId,
      startRent: payload.startRent,
      endRent: payload.endRent,
      status: payload.status,
    });

    await rent.save();

    return { code: 200, status: 'OK', message: 'Book rented successfully.' };
  } catch (error) {
    console.error('Error renting book:', error);
    return {
      code: 500,
      status: 'Internal Server Error',
      message: 'Something went wrong',
    };
  }
};

export const getRentedBooks = async (userId: string) => {
  try {
    await connector();

    const rents = await RentEntity.find({ userId });

    if (!rents.length) {
      return {
        code: 200,
        status: 'OK',
        message: 'Book rented successfully.',
        data: [],
      };
    }

    const rentedBooks = await Promise.all(
      rents.map(async (rent) => {
        const book = await BookEntity.findById(rent.bookId);
        return {
          id: rent._id,
          title: book.title,
          author: book.author,
          image: book.image,
          startDate: rent.startRent,
          endDate: rent.endRent,
          status: rent.status,
        };
      })
    );

    return {
      code: 200,
      status: 'OK',
      message: 'Book rented successfully.',
      data: rentedBooks,
    };
  } catch (error) {
    console.error('Error fetching rented books:', error);
    return {
      code: 500,
      status: 'Internal Server Error',
      message: 'Something went wrong',
    };
  }
};

export const changeStatusRent = async (rentId: string, status: number) => {
  try {
    await connector();

    const updatedRent = await RentEntity.findByIdAndUpdate(
      rentId,
      { status: status },
      { new: true }
    );

    if (!updatedRent) {
      return { code: 404, status: 'Not Found', message: 'Rent record not found.' };
    }

    return { code: 200, status: 'OK', message: 'Book returned successfully.' };
  } catch (error) {
    console.error('Error returning book:', error);
    return {
      code: 500,
      status: 'Internal Server Error',
      message: 'Something went wrong',
    };
  }
};


export const listRentedBooks = async (page = 1, limit = 10, searchTerm = '', status = '') => {
  try {
    await connector();

    const skip = (page - 1) * limit;

    // eslint-disable-next-line
    const matchConditions: any = {};
    if (status) {
      matchConditions.status = parseInt(status, 10);
    }
    if (searchTerm) {
      matchConditions.$or = [
        { 'user.email': { $regex: searchTerm, $options: 'i' } },
        { 'book.title': { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const [rentedBooks, total] = await Promise.all([
      RentEntity.aggregate([
        {
          $lookup: {
            from: 'books',
            localField: 'bookId',
            foreignField: '_id',
            as: 'book',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$book',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: matchConditions,
        },
        {
          $project: {
            _id: 1,
            bookId: 1,
            userId: 1,
            bookName: '$book.title',
            userName: '$user.name',
            userEmail: '$user.email',
            startRent: 1,
            endRent: 1,
            status: 1,
          },
        },
        { $skip: skip },
        { $limit: limit },
      ]),
      RentEntity.countDocuments(matchConditions),
    ]);

    console.log('Rented Books:', rentedBooks);
    console.log('Total Count:', total);

    const totalPages = Math.ceil(total / limit);

    return {
      code: 200,
      status: 'OK',
      data: rentedBooks,
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
export const getTotalRentByStatus = async (status: number) => {
  try {
    await connector();
    return {
      code: 200,
      status: 'OK',
      data: await RentEntity.countDocuments({ status }),
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
