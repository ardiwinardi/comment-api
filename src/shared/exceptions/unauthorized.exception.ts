export class UnauthorizedException extends Error {
  public status: number;
  public message: string;

  constructor(message = 'Unauthorized') {
    super(message);
    this.status = 401;
    this.message = message;
  }
}
