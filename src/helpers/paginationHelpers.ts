import { SortOrder } from 'mongoose';

type IOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  minPrice?: number;
  maxPrice?: number;
};

type IReturnOptions = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: SortOrder;
  skip: number;
  minPrice: number;
  maxPrice: number;
};
const calculatePagination = (options: IOptions): IReturnOptions => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder || 'desc';
  const minPrice = Number(options.minPrice || 0);
  const maxPrice = Number(options.maxPrice || 0);

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    skip,
    minPrice,
    maxPrice,
  };
};

export const paginationHelpers = {
  calculatePagination,
};
