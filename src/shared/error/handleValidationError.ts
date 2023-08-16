import mongoose from 'mongoose';
import { IGenericErrorResponse } from '../../interface/common';
import { IGenericError } from '../../interface/error';

const handleValidationError = (
  err: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const errors: IGenericError[] = Object.values(err.errors).map(
    (el: mongoose.Error.ValidationError) => {
      return {
        path: el?.path,
        message: el?.message,
      };
    }
  );

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorMessage: errors,
  };
};

export default handleValidationError;
