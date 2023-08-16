// import { Response } from 'express';

// type IApiResponse<T> = {
//   statusCode: number;
//   success: boolean;
//   message: string | null;
//   meta?: {
//     limit: number;
//     page: number;
//     count: number;
//   };
//   data: T | null;
// };

// const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
//   const response: IApiResponse<T> = {
//     success: data.success,
//     statusCode: data.statusCode,
//     message: data.message || null,
//     meta: data.meta || null || undefined,
//     data: data.data || null,
//   };
//   res.status(data.statusCode).json(response);
// };

// export default sendResponse;

import type { Response } from 'express';

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

const sendResponse = <T>(res: Response, data: IApiResponse<T>) => {
  const responseData = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    data: data.data,
    meta: data.meta,
  };

  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
