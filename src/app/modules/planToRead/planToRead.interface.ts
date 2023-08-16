import { string } from 'zod';

export type IPlanToRead = {
  book: object;
  bookId: string;
  userEmail: string;
};
