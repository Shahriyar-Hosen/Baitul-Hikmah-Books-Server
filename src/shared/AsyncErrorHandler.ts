import { NextFunction, Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';

const AsyncErrorHandler = (func: RequestHandler) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await func(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default AsyncErrorHandler;
