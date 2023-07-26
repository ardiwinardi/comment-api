import mongoose from "mongoose";
const { Schema } = mongoose;

export interface Reaction {
  userId: string;
  type: "like" | "dislike";
  createdAt: Date;
  updatedAt?: Date;
}

export const reactionSchema = new Schema<Reaction>({
  userId: String,
  type: String,
  createdAt: Date,
  updatedAt: Date,
});
