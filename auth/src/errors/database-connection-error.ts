import { CustomError } from "./custom-error";


export class DatabaseConnectionError extends CustomError {
  reason = 'Error connecting to database';  // not necessary to extend Error, it's just an excuse to pair with RequestValidationError

  constructor() {
    super('Error connecting to database');
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors()  {
    return [{ message: this.reason }];
  }
}
