import { CustomError } from "./custom-error";


export class NotAuthorizedError extends CustomError {
  constructor() {
    super('Not authorized');
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    this.statusCode = 401;
  }

  serializeErrors()  {
    return [{ message: 'Not authorized' }];
  }
}
