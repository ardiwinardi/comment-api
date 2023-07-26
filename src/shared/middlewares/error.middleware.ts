import { NextFunction, Request, Response } from 'express';
import { ValidationException } from '../exceptions/validation.exception';
import { ValidateError } from 'tsoa';

function errorMiddleware(
  error: ValidationException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ValidateError) {
    return res.status(422).json({
      message: 'Validation Failed',
      details: error?.fields
    });
  }
  if (error instanceof Error) {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    const errors = error.errors;
    res.status(status).send({ message, errors });
  }

  next();
}

export default errorMiddleware;
