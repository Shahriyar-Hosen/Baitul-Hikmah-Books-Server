import { Model } from "mongoose";

export type IBook = {
  imgUrl: string;
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
};
export type IBooksFilters = {
  searchTerm?: string;
  genre?: string;
  publicationDate?: string;
};
export type BookModel = Model<IBook>;
