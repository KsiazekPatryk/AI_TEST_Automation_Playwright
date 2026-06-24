import { z } from 'zod';

export const AuthorSchema = z.object({
  id: z.number().int(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
});

export const AuthorArraySchema = z.array(AuthorSchema);
