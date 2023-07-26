
import { User } from '@src/features/auth/entities';
import mongoose, { Document, Schema } from 'mongoose';

export const userSchema = new Schema<User>({
  name: String,
  avatar: String,
  username: String,
  password: String,
  createdAt: Date  
});

const userModel = mongoose.model<User & Document>('users', userSchema);
export default userModel;
