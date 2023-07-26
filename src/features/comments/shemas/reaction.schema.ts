import mongoose from "mongoose";
const { Schema } = mongoose;

export interface Reaction {
  username: string;
  type: "like" | "dislike";
  createdAt: Date;
  updatedAt?: Date;
}

export const reactionSchema = new Schema<Reaction>({
  username: String,
  type: String,
  createdAt: Date,
  updatedAt: Date,
});
