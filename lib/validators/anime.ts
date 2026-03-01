import { z } from "zod";

export const animeListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(48).default(12),
  search: z.string().trim().optional(),
  genre: z.string().trim().optional(),
  yearFrom: z.coerce.number().int().optional(),
  yearTo: z.coerce.number().int().optional(),
  minRating: z.coerce.number().min(0).max(10).optional()
});

export const animeMutationSchema = z.object({
  title: z.string().min(1).max(200),
  synopsis: z.string().min(1),
  releaseYear: z.number().int().min(1960).max(2100),
  episodes: z.number().int().positive(),
  coverImage: z.string().url().optional(),
  avgRating: z.number().min(0).max(10).default(0),
  genres: z.array(z.string()).min(1)
});
