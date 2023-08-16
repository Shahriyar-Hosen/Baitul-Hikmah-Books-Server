/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import config from "../../../config";
import { IUser, UserModel } from "./users.interface";

const UserSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.statics.isPasswordMatch = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean | null> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

UserSchema.pre("save", async function (next) {
  const user = this;
  this.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});
export const User = mongoose.model<IUser, UserModel>("User", UserSchema);
