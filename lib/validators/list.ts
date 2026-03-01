import { z } from "zod";

export const userListMutationSchema = z.object({
  status: z.enum(["WATCHING", "COMPLETED", "PLANNED", "DROPPED"]),
  rating: z.number().int().min(1).max(10).optional()
});
