import { ZodError, ZodIssue } from "zod";
import { IGenericError, IGenericErrorResponse } from "../../interface";

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
