import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../../shared";
import { FinishedBook } from "./finishedBook.model";
import { FinishedBookService } from "./finishedBook.service";

const addFinishedBook = catchAsync(async (req: Request, res: Response) => {
  const book = req.body;

  const isExist = await FinishedBook.findOne({
    userEmail: book?.userEmail,
    bookId: book?.bookId,
  }).lean();

  if (isExist) {
    await FinishedBook.deleteOne({
      userEmail: book?.userEmail,
      bookId: book?.bookId,
    });

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Remove from finished book successfully",
    });
  }
  const result = await FinishedBookService.addFinishedBook(book);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book added in Finished successfully",
    data: result,
  });
});

const getFinishedBook = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await FinishedBookService.getFinishedBook(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Finished book retrieved successfully",
    data: result,
  });
});

export const FinishedBookCtrl = {
  addFinishedBook,
  getFinishedBook,
};
