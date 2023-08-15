import { z } from "zod";

const addBookZodSchema = z.object({
  body: z.object({
    image: z.string({
      required_error: "Image is required",
    }),
    title: z.string({
      required_error: "Title is required",
    }),
    author: z.string({
      required_error: "Author name is required",
    }),
    genre: z.string({
      required_error: "Genre is required",
    }),
    publicationDate: z.string({
      required_error: "Publication Date is required",
    }),
  }),
});

const updateBookZodSchema = z.object({
  body: z.object({
    image: z
      .string({
        required_error: "Image Should be a string",
      })
      .optional(),
    title: z
      .string({
        required_error: "Title Should be a string",
      })
      .optional(),
    author: z
      .string({
        required_error: "Author name Should be a string",
      })
      .optional(),
    genre: z
      .string({
        required_error: "Genre is Should be a string",
      })
      .optional(),
    publicationDate: z
      .string({
        required_error: "Publication Date Should be a string",
      })
      .optional(),
  }),
});

export const BookValidation = {
  addBookZodSchema,
  updateBookZodSchema,
};
