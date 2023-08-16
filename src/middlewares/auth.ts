import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import { ApiError } from '../error/ApiError';
import { jwtHelpers } from '../helpers/jwtHelpers';
import config from '../config';

const auth = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    let verifiedUser = null;

    verifiedUser = jwtHelpers.verifiedToken(token, config.jwt.secret as Secret);

    req.user = verifiedUser;
    // if (userEmail !== verifiedUser.email) {
    //   throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden User');
    // }

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
