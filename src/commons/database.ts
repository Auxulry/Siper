import mongoose from 'mongoose';

const { MONGODB_URI } = process.env;

export const connector = async () => {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI as string);
    if (connection.readyState === 1) {
      console.log(`Connected to database: ${connection.host}`);
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
