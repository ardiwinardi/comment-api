import { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";
import { HttpException } from "../exceptions";
import { ValidationException } from "../exceptions/validation.exception";

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ValidateError) {
    return res.status(422).json({
      message: "validation failed",
      details: error?.fields,
    });
  }

  if (error instanceof ValidationException) {
    return res.status(422).json({
      message: "validation failed",
      details: error.details,
    });
  }

  if (error.status) {
    return res.status(error.status).json({
      message: error.message,
    });
  }

  if (error instanceof Error) {
    const status = 500;
    const message = "Something went wrong";
    res.status(status).send({ message });
  }

  next();
}

export default errorMiddleware;
