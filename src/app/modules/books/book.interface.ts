type Ireview = {
  user: string;
  message: string;
};

export type IBook = {
  title: string;
  author: string;
  genre: string;
  publication: string;
  imageUrl: string;
  userEmail: string;
  reviews: Ireview[];
  publicationYear: string;
};

export type IBookFilters = {
  searchTerm: string;
  genre: string;
  publicationYear: string;
};

export type IReview = {
  user: string;
  review: string;
};

export const filterableFields = ["searchTerm", "genre", "publicationYear"];
export const bookfilterableFields = ["searchTerm", "title", "author", "genre"];
