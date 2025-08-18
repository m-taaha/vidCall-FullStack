import { z } from "zod";

export const registerUserSchema = z.object({
  name: z
    .string({
      required_error: `Name is required`,
    })
    .trim()
    .min(1, { message: `Name cannot be empty` }),

  username: z
    .string({
      required_error: `username is required`,
    })
    .trim()
    .min(1, { message: `username cannot be empty` }),

  email: z
    .string({
      required_error: `Email is required`,
    })
    .trim()
    .email({ message: `Invalid Email address` }),

  password: z
    .string({
      required_error: `Password is required`,
    })
    .min(6, { message: `password must be at least 6 characters long ` }),
});

export const loginUserSchema = z.object({
  email: z
    .string({
      required_error: `Email is required`,
    })
    .trim()
    .email({ message: `Invalid Email address` }),

  password: z
    .string({ required_error: `Password is required` })
    .min(1, { message: `Password cannot be empty` }),
});
