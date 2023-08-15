import { Model } from "mongoose";

export type IBook = {
  image: string;
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
};

export type BookModel = Model<IBook>;
