import mongoose, {model} from 'mongoose';
import {RentSchema} from '@/schemas/rent.schema';
import {RentDeclaration} from '@/types/rent';

const RentEntity = mongoose.models?.Rent || model<RentDeclaration.RentDocument>(
  'Rent',
  RentSchema
);

export default RentEntity;
