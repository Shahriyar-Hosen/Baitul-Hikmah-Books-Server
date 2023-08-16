import httpStatus from 'http-status';
import AsyncErrorHandler from '../../../shared/AsyncErrorHandler';
import { UserService } from './users.service';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';

// get all users
const getAllUsers = AsyncErrorHandler(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get all users successfully',
    data: result,
  });
});

// get single user
const getSingleUser = AsyncErrorHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserService.getSingleUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Find single user successfully',
    data: result,
  });
});

export const UsersCtrl = {
  getAllUsers,
  getSingleUser,
};
