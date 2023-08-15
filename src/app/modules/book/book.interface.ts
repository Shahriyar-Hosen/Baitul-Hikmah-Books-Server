import { Model } from "mongoose";

export type IReviews = {
  name: string;
  email: string;
  message: string;
};

export type IBook = {
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
  publisherEmail: string;
  imgUrl: string;
  reviews?: IReviews[];
};
export type IBooksFilters = {
  searchTerm?: string;
  genre?: string;
  publicationDate?: string;
};
export type BookModel = Model<IBook>;
