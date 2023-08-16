import { z } from 'zod';

const updateMyProfileZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    name: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const UserValidation = {
  updateMyProfileZodSchema,
};
