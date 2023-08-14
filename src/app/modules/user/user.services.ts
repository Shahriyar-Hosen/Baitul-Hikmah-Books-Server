import jwt from "jsonwebtoken";
import { IUser } from "./user.interface";
import { User } from "./user.model";

// interface Idecode {
//   useremail: string;
//   role: string;
// }

const createUser = async (payload: IUser) => {
  const createdUser = await User.create(payload);
  return createdUser;
};
const getAllUsers = async () => {
  const result = await User.find();
  return result;
};

const updateUserDetails = async (id: string, payload: Partial<IUser>) => {
  const updatedCow = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return updatedCow;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id);
  return result;
};
const getOneUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

const getMyProfile = async (token: string | undefined) => {
  const decodedToken: any = jwt.decode(token as string);

  const { userEmail } = decodedToken;

  const getProfile = await User.findOne({ email: userEmail });
  return {
    getProfile,
  };
};
const updateProfile = async (token: string, payload: Partial<IUser>) => {
  const decodedToken: any = jwt.decode(token as string);

  const { userPhoneNumber } = decodedToken;

  const updatedProfile = await User.findOneAndUpdate(
    { email: userPhoneNumber },
    payload,
    {
      new: true,
    }
  );
  return {
    updatedProfile,
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
  getOneUser,
  updateUserDetails,
  deleteUser,
  getMyProfile,
  updateProfile,
};
