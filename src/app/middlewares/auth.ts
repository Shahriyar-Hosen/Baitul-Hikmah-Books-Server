import { jwtHelpers } from "./../../helpers/jwtHelpers";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import { ApiError } from "../../errors";

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, " Unauthorized user");
      }
      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(
        token,
        config.access_secret as Secret
      );

      // req.user = verifiedUser;

      // to check by role
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
