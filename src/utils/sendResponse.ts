import { Response } from "express";
import { IApiResponse } from "../interfaces/common";

export const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    meta: data.meta || null || undefined,
    data: data.data || null,
  };
  res.status(data.statusCode).json(responseData);
};
