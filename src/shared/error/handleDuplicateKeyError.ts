import { IGenericErrorResponse } from '../../interface/common';

type MongooseError = {
  keyValue: Record<string, unknown>;
};

const handleDuplicateKeyError = (err: MongooseError): IGenericErrorResponse => {
  const errorMessage = Object.keys(err.keyValue).map(key => ({
    path: key,
    message: `Duplicate ${key} entered`,
  }));

  return {
    statusCode: 400,
    message: 'Duplicate key error',
    errorMessage,
  };
};

export default handleDuplicateKeyError;
