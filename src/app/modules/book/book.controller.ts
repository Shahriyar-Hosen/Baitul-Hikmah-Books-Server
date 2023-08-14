import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../../utils";
import { BookServices } from "./book.services";

const addBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const book = req.body;
    const result = await BookServices.addBook(book);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Book added successfully",
      data: result,
    });
    next();
  }
);
const getBooks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await BookServices.getBooks();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Book  List",
      data: result,
    });
    next();
  }
);
const getOneBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await BookServices.getOneBook(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get one Book",
      data: result,
    });
    next();
  }
);
const editBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const data = req.body;
    const result = await BookServices.editBook(id, data);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Book updated successfully",
      data: result,
    });
    next();
  }
);
const deleteBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await BookServices.deleteBook(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Book deleted successfully",
      data: result,
    });
    next();
  }
);

export const BookController = {
  addBook,
  getBooks,
  getOneBook,
  editBook,
  deleteBook,
};
