
export class ValidationException extends Error {
  public status: number;
  public message: string;
  public details: object;

  constructor(details?: object) {
    super('Validation failed');
    this.status = 500;
    this.message = 'Validation failed';
    this.details = details;
  }
}
