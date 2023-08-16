import type { Response } from "express";

type IApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    count: number;
  };
};

export const sendResponse = <T>(res: Response, data: IApiResponse<T>) => {
  const responseData = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    data: data.data,
    meta: data.meta,
  };

  res.status(data.statusCode).json(responseData);
};
