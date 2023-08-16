import { ApiError } from '../../../error/ApiError';
import { JwtPayload } from 'jsonwebtoken';
import { IFinishedBook } from './finishedBook.interface';
import { FinishedBook } from './finishedBook.model';

const addFinishedBook = async (payload: IFinishedBook) => {
  const result = await FinishedBook.create(payload);
  if (!result) {
    throw new ApiError(404, 'added finished book failed');
  }
  return result;
};

const getFinishedBook = async (user: JwtPayload | null) => {
  const result = await FinishedBook.find({ userEmail: user?.email }).lean();

  return {
    data: result,
  };
};

export const FinishedBookService = {
  addFinishedBook,
  getFinishedBook,
};
