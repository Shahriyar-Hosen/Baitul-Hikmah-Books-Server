import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../../config';
import { IGenericError } from '../../interface/error';
import { ApiError } from '../../shared/error/ApiError';
import handleCastError from '../../shared/error/handleCastError';
import handleDuplicateKeyError from '../../shared/error/handleDuplicateKeyError';
import handleValidationError from '../../shared/error/handleValidationError';
import handleZodError from '../../shared/error/handleZodError';

export const globalErrorHandle: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  let statusCode = 500;
  let message = 'somthing went wrong';
  let errorMessage: IGenericError[] = [];

  // eslint-disable-next-line no-unused-expressions
  config.env === 'development'
    ? // eslint-disable-next-line no-console
      console.log('🐘  globalErrorHandle', error)
    : console.log('🐘  globalErrorHandle', error);

  if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessage = simplifiedError?.errorMessage;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError?.message;
    errorMessage = simplifiedError?.errorMessage;
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError?.message;
    errorMessage = simplifiedError?.errorMessage;
  } else if (error.code === 11000) {
    const simplifiedError = handleDuplicateKeyError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessage;
  } else if (error instanceof ApiError) {
    statusCode = error?.statuscode;
    message = error?.message;
    errorMessage = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessage = error?.message
      ? [
          {
            path: '',
            message: '',
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    stack: config.env !== 'production' ? error.stack : undefined,
  });
  next();
};
