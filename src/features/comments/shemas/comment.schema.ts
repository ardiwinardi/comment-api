import mongoose, { Document } from 'mongoose';
import { userSchema } from '../../auth/schemas/user.schema';
import { Reaction, reactionSchema } from './reaction.schema';
const { Schema } = mongoose;

export interface Comment {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  comment: string;
  reactions: Reaction[];
  createdAt: Date;
  updatedAt?: Date;
}

export const commentSchema = new Schema<Comment>({
  user: userSchema,
  comment: String,
  reactions: [reactionSchema],
  createdAt: Date,
  updatedAt: Date
});

const commentModel = mongoose.model<Comment & Document>(
  'comments',
  commentSchema
);
export default commentModel;
