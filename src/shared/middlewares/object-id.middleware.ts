import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { HttpException, ValidationException } from '../exceptions';

const isValidId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      const detail = {
        ['payload.id']: {
          message: 'id must be a valid object id',
          value: id
        }
      };
      next(new ValidationException(detail));
    }else{
      next();
    }
  } catch (error) {
    next(new HttpException(500, `Something went wrong`));
  }  
};

export default isValidId;
