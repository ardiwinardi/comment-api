import { ValidationError, validate } from 'class-validator';
import { isValidObjectId } from 'mongoose';
import { ValidationException } from '../exceptions/validation.exception';

export const validatePayload = async (payload: object) => {
  const errors = await validate(payload);
  if (errors.length) throw new ValidationException(errors);
};

export const validateId = (id: string) => {
  if (!isValidObjectId(id)) {
    const error = new ValidationError();
    error.property = 'id';
    error.constraints = {
      isObjectId: 'id must be a valid object id'
    };
    throw new ValidationException([error]);
  }
};
