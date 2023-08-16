import { IGenericError } from "./error";

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessage: IGenericError[];
};

export type IGenericResponse<T> = {
  meta: {
    page: number;
    limit: number;
    count: number;
  };
  data: T;
};
