import { CustomError } from "./custom-error";


export class NotFoundError extends CustomError {
  constructor() {
    super('Error connecting to database');
    Object.setPrototypeOf(this, NotFoundError.prototype);
    this.statusCode = 404;
  }

  serializeErrors()  {
    return [{ message: 'Not Found' }];
  }
}
