import mongoose, {model} from 'mongoose';
import {UserDeclaration} from '@/types/user';
import {UserSchema} from '@/schemas/user.schema';

const UserEntity = mongoose.models?.User || model<UserDeclaration.UserDocument>(
  'User',
  UserSchema
);

export default UserEntity;
