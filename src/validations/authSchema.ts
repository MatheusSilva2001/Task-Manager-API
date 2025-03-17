import { z } from "zod";

export const authSchema = z
  .object({
    email: z
      .string()
      .email("email poorly formatted")
      .max(255, "max 255 characters"),

    password: z.string().max(255, "max 255 characters"),
  })
  .strict();

//extract the inferred type
export type AuthDataTypes = z.infer<typeof authSchema>;
