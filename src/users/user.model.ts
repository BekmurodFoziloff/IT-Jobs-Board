import { model } from 'mongoose';
import { User } from './user.interface';
import UserSchema from './schema/user.schema';

const UserModel = model<User>('User', UserSchema);

export default UserModel;
