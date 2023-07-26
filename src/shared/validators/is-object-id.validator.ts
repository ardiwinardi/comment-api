import { registerDecorator } from 'class-validator';
import { isValidObjectId } from 'mongoose';
import logger from '../commons/logger';

export function IsObjectId() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be valid object id`
      },
      validator: {
        validate(value: string) {
          logger.info(value);
          return isValidObjectId(value);
        }
      }
    });
  };
}
