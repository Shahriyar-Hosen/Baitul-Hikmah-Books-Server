/* eslint-disable @typescript-eslint/no-this-alias */
import mongoose, { Schema } from 'mongoose';
import { IPlanToRead } from './planToRead.interface';

const planToReadSchema = new Schema<IPlanToRead>(
  {
    book: {
      type: Object,
      required: true,
    },
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

export const PlanToRead = mongoose.model<IPlanToRead>(
  'PlanToRead',
  planToReadSchema
);
