import { ValidationError } from 'class-validator';

export class ValidationException extends Error {
  public status: number;
  public message: string;
  public errors?: object;

  constructor(errors: ValidationError[]) {
    super('error validation');
    this.status = 500;
    this.message = 'error validation';
    this.errors = errors;
  }
}
