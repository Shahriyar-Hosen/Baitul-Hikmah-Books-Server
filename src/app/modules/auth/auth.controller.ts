import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import { catchAsync, sendResponse } from "../../../shared";
import { AuthService } from "./auth.service";

// login users
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  const { refreshToken, ...others } = result;

  const refreshToken_options = {
    secure: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, refreshToken_options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: others,
  });
});

const createUser = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await AuthService.createUser(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User create successfull",
    data: result,
  });
});

// login users service

export const AuthCtrl = {
  createUser,
  loginUser,
};
