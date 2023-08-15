import { Schema, model } from "mongoose";
import { BookModel, IBook } from "./book.interface";

const bookSchema = new Schema<IBook, BookModel>(
  {
    imgUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    publicationDate: {
      type: String,
      required: true,
    },
    publisherEmail: {
      type: String,
      required: true,
    },
    reviews: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      message: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Book = model<IBook, BookModel>("Book", bookSchema);
