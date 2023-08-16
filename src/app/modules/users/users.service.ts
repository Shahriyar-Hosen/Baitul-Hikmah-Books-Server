import { ApiError } from '../../../shared/error/ApiError';
import { IUser } from './users.interface';
import { User } from './users.model';

const getAllUsers = async () => {
  const result = await User.find({});
  if (!result) {
    throw new ApiError(404, 'get all users not found!');
  }
  return result;
};

const getSingleUser = async (id: string) => {
  const result = await User.findById({ _id: id });
  if (!result) {
    throw new ApiError(404, 'get single user not found!');
  }
  return result;
};

const updateUser = async (id: string, payload: IUser) => {
  const result = await User.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  if (!result) {
    throw new ApiError(404, 'update user not found!');
  }
  return result;
};

const deleteUser = async (id: string) => {
  const result = await User.findByIdAndDelete({ _id: id });
  if (!result) {
    throw new ApiError(404, 'delete user not found!');
  }
  return result;
};

export const UserService = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
