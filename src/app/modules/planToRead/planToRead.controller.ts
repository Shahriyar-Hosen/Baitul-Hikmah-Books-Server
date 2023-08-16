import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../shared";
import sendResponse from "../../../shared/sendResponse";
import { PlanToRead } from "./planToRead.model";
import { PlanToReadService } from "./planToRead.service";

const addPlanToRead = catchAsync(async (req: Request, res: Response) => {
  const book = req.body;

  const isExist = await PlanToRead.findOne({
    userEmail: book?.userEmail,
    bookId: book?.bookId,
  }).lean();

  if (isExist) {
    await PlanToRead.deleteOne({
      userEmail: book?.userEmail,
      bookId: book?.bookId,
    });

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Remove from Plan To Read successfully",
    });
  }
  const result = await PlanToReadService.addPlanToRead(book);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book added in Plan To Read successfully",
    data: result,
  });
});

const getPlanToRead = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await PlanToReadService.getPlanToRead(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "PlanToRead retrieved successfully",
    data: result,
  });
});

export const PlanToReadCtrl = {
  addPlanToRead,
  getPlanToRead,
};
