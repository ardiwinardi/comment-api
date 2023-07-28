import mongoose, { Document } from "mongoose";

import { userSchema } from "@src/features/auth/schemas";
import { Reaction, reactionSchema } from "./reaction.schema";
const { Schema } = mongoose;

export interface Comment {
  id?: string;
  user: {
    username: string;
    name: string;
  };
  comment: string;
  reactions: Reaction[];
  totalLiked?: number;
  totalDisliked?: number;
  createdAt: Date;
  updatedAt?: Date;
}

export const commentSchema = new Schema<Comment>({
  user: userSchema,
  comment: String,
  reactions: [reactionSchema],
  totalLiked: Number,
  totalDisliked: Number,
  createdAt: Date,
  updatedAt: Date,
});

const commentModel = mongoose.model<Comment & Document>(
  "comment",
  commentSchema
);
export default commentModel;
