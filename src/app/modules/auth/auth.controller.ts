import httpStatus from "http-status";
import { NextFunction, Request, RequestHandler, Response } from "express";
import config from "../../../config";
import { catchAsync, sendResponse } from "../../../utils";
import { ILoginUserResponse, IRefreshTokenResponse } from "./auth.interface";
import { AuthServices } from "./auth.services";

const userSignup: RequestHandler = async (req, res, next) => {
  try {
    const user = req.body;
    console.log(user);
    const result = await AuthServices.userSignUp(user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User create successfully !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...loginData } = req.body;
    const result = await AuthServices.loginUser(loginData);
    const { refreshToken, ...others } = result;

    const cookiesOption = {
      secure: config.env === "production" ? true : false,
      httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookiesOption);

    sendResponse<ILoginUserResponse>(res, {
      statusCode: 200,
      success: true,
      message: "User logged in successfully !",
      data: others,
    });
    next();
  }
);

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: "New access token generated successfully !",
    data: result,
  });
});
export const AuthController = {
  userSignup,
  loginUser,
  refreshToken,
};
