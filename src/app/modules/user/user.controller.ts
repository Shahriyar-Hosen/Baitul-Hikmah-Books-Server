import httpStatus from "http-status";
import { RequestHandler } from "express";
import { sendResponse } from "../../../utils";
import { IUser } from "./user.interface";
import { UserServices } from "./user.services";

const createUser: RequestHandler = async (req, res, next) => {
  try {
    const user = req.body;
    const result = await UserServices.createUser(user);
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

const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.getAllUsers();

    sendResponse<IUser[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users retrieved successfully !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserDetails: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const result = await UserServices.updateUserDetails(id, data);
    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User updated successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await UserServices.deleteUser(id);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users deleted successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getOneUser: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await UserServices.getOneUser(id);
    if (result) {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User retrieved successfully!",
        data: result,
      });
    } else {
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Data not found!",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getMyProfile: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const result = await UserServices.getMyProfile(token);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get profile retrieved successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const data = req.body;
    const result = await UserServices.updateProfile(token as string, data);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "profile updated successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createUser,
  getAllUsers,
  updateUserDetails,
  getOneUser,
  deleteUser,
  getMyProfile,
  updateProfile,
};
