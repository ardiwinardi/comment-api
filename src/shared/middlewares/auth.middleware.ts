import { DataStoredInToken } from "@src/features/auth/entities";
import userModel from "@src/features/auth/schemas/user.schema";
import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { SECRET_KEY } from "../configs/config";
import { HttpException } from "../exceptions";
import { RequestWithUser } from "../interfaces/request";

const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const Authorization =
      (req.header('Authorization')
        ? req.header('Authorization').split('Bearer ')[1]
        : null);

    if (Authorization) {
      const verificationResponse = verify(
        Authorization,
        SECRET_KEY
      ) as DataStoredInToken;
      
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'invalid token'));
      }
    } else {
      next(new HttpException(401, 'token is missing'));
    }
  } catch (error) {
    next(new HttpException(401, `authentication error : ${error.message}`));
  }
};

export default authMiddleware;
