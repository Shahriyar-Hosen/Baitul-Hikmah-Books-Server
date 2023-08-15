import { SortOrder } from "mongoose";
import { paginationHelpers } from "../../../helpers";
import { IPaginationOptionResult } from "../../../interfaces";
import { booksSearchableFields } from "./book.constants";
import { IBook, IBooksFilters } from "./book.interface";
import { Book } from "./book.model";

const addBook = async (payload: IBook) => {
  const addedBook = await Book.create(payload);
  return addedBook;
};

const getBooks = async (
  filters: IBooksFilters,
  paginationOptions: IPaginationOptionResult
) => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: booksSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Book.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getOneBook = async (id: string) => {
  return await Book.findById(id);
};
const editBook = async (id: string, data: Partial<IBook>) => {
  return await Book.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
};
const deleteBook = async (id: string) => {
  return await Book.findOneAndDelete({ _id: id });
};

export const BookServices = {
  addBook,
  editBook,
  deleteBook,
  getBooks,
  getOneBook,
};
