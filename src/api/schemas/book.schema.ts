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

export const PatchBookPayloadSchema = z.record(z.string(), z.object({}).passthrough());

export const PatchBookResponseSchema = z.record(z.string(), z.unknown());

export const RestBookAuthorSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })
  .passthrough();

export const RestBookSchema = z
  .object({
    id: z.number().int().optional(),
    title: z.string().optional(),
    year: z.number().int().optional(),
    price: z.number().optional(),
    coverUrl: z.string().nullable().optional(),
    available: z.number().int().optional(),
    authors: z.array(RestBookAuthorSchema).optional(),
  })
  .passthrough();

export const RestBooksSchema = z.array(RestBookSchema);
