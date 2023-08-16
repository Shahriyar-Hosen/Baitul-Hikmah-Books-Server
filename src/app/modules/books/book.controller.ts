import { Request, Response } from 'express';
import httpStatus from 'http-status';
import AsyncErrorHandler from '../../../shared/AsyncErrorHandler';
import { ApiError } from '../../../shared/error/ApiError';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { filterableFields } from './book.interface';
import { BookService } from './book.service';

const addNewBook = AsyncErrorHandler(async (req: Request, res: Response) => {
  const user = req.user;
  const { userEmail } = req.body;

  if (user && userEmail !== user.email) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden User');
  }

  const result = await BookService.addNewBook(user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New Book create successfully',
    data: result,
  });
});

const getAllBooks = AsyncErrorHandler(async (req: Request, res: Response) => {
  const filters = pick(req.query, filterableFields);

  const result = await BookService.getAllBooks(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Books retrieved successfully',
    data: result,
  });
});

const getSingleBook = AsyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BookService.getSingleBook(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book retrieved successfully',
    data: result,
  });
});

const getFeaturedBooks = AsyncErrorHandler(
  async (req: Request, res: Response) => {
    const result = await BookService.getFeaturedBooks();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Featured Book retrieved successfully',
      data: result,
    });
  }
);

const updateBook = AsyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BookService.updateBook(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book update successfully',
    data: result,
  });
});

const deleteBook = AsyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BookService.deleteBook(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book delete successfully',
    data: result,
  });
});

const addReview = AsyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log(
    'req.body review=============================================================================',
    req.body
  );
  const result = await BookService.addReview(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review added successfully',
    data: result,
  });
});

const getPublishedYears = AsyncErrorHandler(
  async (req: Request, res: Response) => {
    const genre = req.query.genre as string;

    const result = await BookService.getPublishedYears(genre);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Published year retrieved successfully',
      data: result,
    });
  }
);

export const BookCtrl = {
  addNewBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
  getFeaturedBooks,
  addReview,
  getPublishedYears,
};
