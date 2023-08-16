/* eslint-disable @typescript-eslint/no-this-alias */
import mongoose, { Schema } from 'mongoose';
import { IFinishedBook } from './finishedBook.interface';

const FinishedBookSchema = new Schema<IFinishedBook>(
  {
    bookId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FinishedBook = mongoose.model<IFinishedBook>(
  'FinishedBook',
  FinishedBookSchema
);
