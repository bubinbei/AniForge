import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { fail, ok } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const user = await requireUser();

    const rated = await prisma.userAnimeList.findMany({
      where: { userId: user.id, rating: { gte: 8 } },
      include: {
        anime: {
          include: {
            genres: { include: { genre: true } }
          }
        }
      }
    });

    const genreCounter = new Map<string, number>();
    for (const item of rated) {
      for (const link of item.anime.genres) {
        genreCounter.set(link.genre.slug, (genreCounter.get(link.genre.slug) ?? 0) + 1);
      }
    }

    const favoriteGenres = [...genreCounter.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([slug]) => slug);

    const sourceAnimeIds = rated.map((it) => it.animeId);
    const candidates = await prisma.anime.findMany({
      where: {
        id: { notIn: sourceAnimeIds },
        genres: {
          some: {
            genre: { slug: { in: favoriteGenres } }
          }
        }
      },
      include: {
        genres: {
          include: { genre: true }
        }
      },
      take: 10
    });

    const picks = candidates.map((anime) => ({
      ...anime,
      reason: `Рекомендовано: любимые жанры ${favoriteGenres.join(", ") || "по вашему профилю"}`
    }));

    return NextResponse.json(ok({ dailyPicks: picks }));
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json(fail("UNAUTHORIZED", "Требуется авторизация"), { status: 401 });
    }
    return NextResponse.json(fail("INTERNAL_ERROR", "Внутренняя ошибка", String(error)), { status: 500 });
  }
}
