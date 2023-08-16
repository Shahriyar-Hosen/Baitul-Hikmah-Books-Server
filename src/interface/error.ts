import { Model } from "mongoose";
import { IUser } from "../app/modules/users/users.interface";

export type IGenericError = {
  path: string | number;
  message: string;
};

export type userModel = Model<IUser, Record<string, unknown>>;
