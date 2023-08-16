import { ZodError, ZodIssue } from "zod";
import { IGenericErrorResponse } from "../../interface";
import { IGenericError } from "../../interface/error";

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errors: IGenericError[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: "Validation Error",
    errorMessage: errors,
  };
};

export default handleZodError;
