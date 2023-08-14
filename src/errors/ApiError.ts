export class ApiError extends Error {
  statusCode: number;

  constructor(statuscode: number, message: string | undefined, stack = "") {
    super(message);
    this.statusCode = statuscode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
