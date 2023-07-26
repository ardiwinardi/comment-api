import { validate } from 'class-validator';
import { isValidObjectId } from 'mongoose';
import { ValidationException } from '../exceptions/validation.exception';

export const validatePayload = async (payload: object) => {
  const errors = await validate(payload);
  if (errors.length) throw new ValidationException(errors);
};

export const validateId = (id: string) : void | ValidationException => {
  if (!isValidObjectId(id)) {
    const detail = {
      ['payload.id']:{
        message:'id must be a valid object id',
        value: id
      }
    }
    throw new ValidationException(detail);
  }
};
