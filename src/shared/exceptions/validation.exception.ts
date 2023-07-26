export class ValidationException extends Error {
  public details: object;

  constructor(details?: object) {
    super();
    this.details = details;
  }
}
