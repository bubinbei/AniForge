import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function listAnime(query: {
  page: number;
  pageSize: number;
  search?: string;
  genre?: string;
  yearFrom?: number;
  yearTo?: number;
  minRating?: number;
}) {
  const where: Prisma.AnimeWhereInput = {
    AND: [
      query.search ? { title: { contains: query.search, mode: "insensitive" } } : {},
      query.minRating ? { avgRating: { gte: query.minRating } } : {},
      query.yearFrom || query.yearTo
        ? {
            releaseYear: {
              gte: query.yearFrom,
              lte: query.yearTo
            }
          }
        : {},
      query.genre
        ? {
            genres: {
              some: {
                genre: {
                  slug: query.genre
                }
              }
            }
          }
        : {}
    ]
  };

  const skip = (query.page - 1) * query.pageSize;
  const [items, total] = await Promise.all([
    prisma.anime.findMany({
      where,
      skip,
      take: query.pageSize,
      orderBy: [{ popularityScore: "desc" }, { createdAt: "desc" }],
      include: {
        genres: {
          include: {
            genre: true
          }
        }
      }
    }),
    prisma.anime.count({ where })
  ]);

  return {
    items,
    total,
    page: query.page,
    pageSize: query.pageSize,
    totalPages: Math.ceil(total / query.pageSize)
  };
}

export async function getAnimeById(id: string) {
  return prisma.anime.findUnique({
    where: { id },
    include: {
      genres: {
        include: {
          genre: true
        }
      }
    }
  });
}
