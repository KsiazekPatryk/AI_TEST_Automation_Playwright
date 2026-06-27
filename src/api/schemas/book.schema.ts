import { z } from 'zod';
import { AuthorSchema } from '@api/schemas/author.schema';

export const BookSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  year: z.number().int(),
  price: z.number(),
  coverId: z.number().int().nullable(),
  available: z.number().int(),
  authors: z.array(AuthorSchema),
});

export const BookArraySchema = z.array(BookSchema);
