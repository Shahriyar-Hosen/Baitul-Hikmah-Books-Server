import { z } from "zod";

const createUserZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
    name: z.object({
      firstName: z.string({
        required_error: "First Name is required",
      }),
      lastName: z.string({
        required_error: "Last name is required",
      }),
    }),
  }),
});

export const UserValidation = {
  createUserZodSchema,
};
