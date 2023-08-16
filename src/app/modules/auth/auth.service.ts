import httpStatus from 'http-status';
import { ApiError } from '../../../error/ApiError';
import { IUser } from '../../modules/users/users.interface';
import { User } from '../../modules/users/users.model';
import { IJWTResponse, IUserAuth } from './auth.interface';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

const createUser = async (payload: IUser) => {
  console.log('duplicate', payload);
  const user = await User.find(payload);
  const result = await User.create(payload);

  if (!result) {
    throw new ApiError(404, 'signup request failed!');
  }
  return result;
};

// login
const loginUser = async (payload: IUserAuth) => {
  const { email: userEmail, password } = payload;

  const isUserExit = await User.findOne({ email: userEmail });
  console.log('sUserExit', isUserExit, userEmail);

  if (!isUserExit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (
    isUserExit?.password &&
    !(await User.isPasswordMatch(password, isUserExit.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password not match!');
  }

  const { _id: id, email } = isUserExit;

  const accessToken = jwtHelpers.createToken(
    { id, email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    { id, email },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    email,
  };
};

export const AuthService = {
  createUser,
  loginUser,
};
