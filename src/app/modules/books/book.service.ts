/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../../../shared/error";
import { IBook, IBookFilters, IReview } from "./book.interface";
import { Book } from "./book.model";

const addNewBook = async (user: JwtPayload | null, payload: IBook) => {
  const result = await Book.create(payload);
  if (!result) {
    throw new ApiError(404, "New Book create failed");
  }

  return result;
};

const getAllBooks = async (filters: IBookFilters | any) => {
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];
  const bookFilterData = ["title", "author", "genre"];

  if (searchTerm) {
    andConditions.push({
      $or: bookFilterData.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};
  const result = await Book.find(whereConditions)
    .sort({ createdAt: -1 })
    .lean();

  const total = await Book.countDocuments();

  return {
    data: result,
  };
};

const getFeaturedBooks = async () => {
  const result = await Book.find({}).sort({ createdAt: -1 }).limit(10);

  if (!result) {
    throw new ApiError(404, "Book not found!");
  }

  return result;
};

const getSingleBook = async (id: string) => {
  const result = await Book.findById({ _id: id }).lean();

  if (!result) {
    throw new ApiError(404, "Book not found!");
  }

  return result;
};

const updateBook = async (id: string, payload: IBook) => {
  const result = await Book.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });

  if (!result) {
    throw new ApiError(404, "update book not found!");
  }

  return result;
};

const deleteBook = async (id: string) => {
  const result = await Book.deleteOne({ _id: id }).lean();

  if (!result) {
    throw new ApiError(404, "Book not delete successful!");
  }

  return result;
};

const addReview = async (id: string, payload: IReview) => {
  const book: IBook | null = await Book.findByIdAndUpdate(
    id,
    { $push: { reviews: { $each: [payload], $position: 0 } } },
    { new: true }
  ).lean();

  if (!book) {
    throw new ApiError(404, "No book found");
  }

  return book;
};

const getPublishedYears = async (genre: string) => {
  const result = await Book.find({ genre }).lean();

  const uniqueValues: any[] = [];

  result.forEach(data => {
    if (!uniqueValues.includes(data?.publicationYear)) {
      uniqueValues.push(data?.publicationYear);
    }
  });

  return uniqueValues;
};

export const BookService = {
  addNewBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
  getFeaturedBooks,
  addReview,
  getPublishedYears,
};
