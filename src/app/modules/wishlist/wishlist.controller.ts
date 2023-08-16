import httpStatus from 'http-status';
import AsyncErrorHandler from '../../../shared/AsyncErrorHandler';
import sendResponse from '../../../shared/sendResponse';
import { Request, Response } from 'express';
import { WishlistService } from './wishlist.service';
import { Wishlist } from './wishlist.model';
import { ApiError } from '../../../error/ApiError';

const addBookWishlist = AsyncErrorHandler(
  async (req: Request, res: Response) => {
    const book = req.body;

    const isExist = await Wishlist.findOne({
      userEmail: book?.userEmail,
      bookId: book?.bookId,
    }).lean();

    if (isExist) {
      await Wishlist.deleteOne({
        userEmail: book?.userEmail,
        bookId: book?.bookId,
      });

      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Remove from wishlist successfully',
      });
    }
    const result = await WishlistService.addBookWishlist(book);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book added in wishlist successfully',
      data: result,
    });
  }
);

const getWishlists = AsyncErrorHandler(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await WishlistService.getWishlists(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wishlist retrieved successfully',
    data: result,
  });
});

export const WishlistCtrl = {
  addBookWishlist,
  getWishlists,
};
