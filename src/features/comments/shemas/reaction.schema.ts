import mongoose from "mongoose";
const { Schema } = mongoose;

export enum ReactionType {
  LIKE = "like",
  DISLIKE = "dislike",
}

export interface Reaction {
  username: string;
  type: ReactionType;
  createdAt: Date;
  updatedAt?: Date;
}

export const reactionSchema = new Schema<Reaction>({
  username: String,
  type: String,
  createdAt: Date,
  updatedAt: Date,
});
