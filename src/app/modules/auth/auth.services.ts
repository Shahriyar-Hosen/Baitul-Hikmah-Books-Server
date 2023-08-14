import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../../config";
import { ApiError } from "../../../errors";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from "./auth.interface";
import httpStatus from "http-status";

const userSignUp = async (user: IUser) => {
  const createdUser = await User.create(user);
  return createdUser;
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;
  const isExistUser = await User.isUserExist(email);
  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not found");
  }

  const isPasswordMatched = await User.isPasswordMatched(
    password,
    isExistUser.password
  );

  if (!isPasswordMatched) {
    throw new Error("Password does't matched");
  }

  const { email: userEmail } = isExistUser;

  const accessToken = jwt.sign({ userEmail }, config.access_secret as Secret, {
    expiresIn: config.access_expire_time,
  });
  const refreshToken = jwt.sign(
    { userEmail },
    config.refresh_token_secret as Secret,
    { expiresIn: config.refresh_token_expire_time }
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwt.verify(
      token,
      config.refresh_token_secret as Secret
    ) as JwtPayload;
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid Refresh Token");
  }

  const { userEmail } = verifiedToken;

  const isUserExist = await User.isUserExist(userEmail);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }
  //generate new token

  const newAccessToken = jwt.sign(
    { email: isUserExist.email },
    config.access_secret as Secret,
    { expiresIn: config.access_expire_time }
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthServices = {
  userSignUp,
  loginUser,
  refreshToken,
};
