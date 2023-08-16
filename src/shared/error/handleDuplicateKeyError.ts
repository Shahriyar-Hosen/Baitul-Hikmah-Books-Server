import { IGenericErrorResponse } from "../../interface";

type MongooseError = {
  keyValue: Record<string, unknown>;
};

export const handleDuplicateKeyError = (
  err: MongooseError
): IGenericErrorResponse => {
  const errorMessage = Object.keys(err.keyValue).map(key => ({
    path: key,
    message: `Duplicate ${key} entered`,
  }));

  return {
    statusCode: 400,
    message: "Duplicate key error",
    errorMessage,
  };
};
