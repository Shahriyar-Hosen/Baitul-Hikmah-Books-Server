import { Model } from 'mongoose';

export type IUser = {
  name: string;
  email: string;
  password: string;
};

export type UserModel = {
  isPasswordMatch(givenPass: string, password: string): Promise<boolean | null>;
} & Model<IUser>;
