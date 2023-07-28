import { DataStoredInToken } from "@src/features/auth/entities";
import userModel from "@src/features/auth/schemas/user.schema";
import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { SECRET_KEY } from "../configs/config";
import { HttpException } from "../exceptions";
import { RequestWithUser } from "../interfaces/request";

const isAuthenticated = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")
      ? req.header("Authorization").split("Bearer ")[1]
      : null;

    if (token) {
      const verificationResponse = verify(
        token,
        SECRET_KEY
      ) as DataStoredInToken;

      const userId = verificationResponse._id;
      const user = await userModel.findById(userId).select("-password");

      if (user) {
        req.user = user;
        next();
      } else {
        next(new HttpException(401, "invalid token"));
      }
    } else {
      next(new HttpException(401, "token is missing"));
    }
  } catch (error) {
    next(new HttpException(401, `authentication error : ${error.message}`));
  }
};

export default isAuthenticated;
