export class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(message: string) {
    super(message);
    this.status = 500;
    this.message = message;
  }
}
