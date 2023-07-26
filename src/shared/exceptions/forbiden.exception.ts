export class ForbidenException extends Error {
  public status: number;
  public message: string;

  constructor(message = 'Forbiden') {
    super(message);
    this.status = 403;
    this.message = message;
  }
}
