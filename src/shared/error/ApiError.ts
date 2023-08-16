export class ApiError extends Error {
  statuscode: number;
  constructor(statuscode: number, message: string | undefined, stack = "") {
    super(message);
    this.statuscode = statuscode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
