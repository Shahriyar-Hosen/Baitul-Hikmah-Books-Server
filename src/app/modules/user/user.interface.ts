/* eslint-disable no-unused-vars */
import { Model } from "mongoose";

export type IUser = {
  email: string;
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
};

export type UserModel = {
  isUserExist(id: string): Promise<Pick<IUser, "email" | "password">>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
