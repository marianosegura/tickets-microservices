import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";


export class RequestValidationError extends CustomError {
  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
    this.statusCode = 400;
  }

  serializeErrors()  {
    return this.errors.map(error => ({
        message: error.msg,
        field: error.param  
    }));
  }
}
