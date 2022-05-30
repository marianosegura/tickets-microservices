export abstract class CustomError extends Error {
  statusCode: number = 500;

  constructor(message: string) {
    super(message);
    // required since we are extending a builtin class (Error)
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
