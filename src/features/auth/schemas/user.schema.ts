import mongoose, { Document, Schema } from "mongoose";

export interface User {
  _id: string;
  name: string;
  avatar?: string;
  username: string;
  password?: string;
  createdAt?: Date;
}

export const userSchema = new Schema<User>({
  name: String,
  avatar: String,
  username: String,
  password: String,
  createdAt: Date,
});

const userModel = mongoose.model<User & Document>("user", userSchema);
export default userModel;
