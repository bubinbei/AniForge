import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { listAnime } from "@/lib/services/anime-service";
import { animeListQuerySchema, animeMutationSchema } from "@/lib/validators/anime";
import { fail, ok } from "@/lib/utils/api-response";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = animeListQuerySchema.safeParse(Object.fromEntries(searchParams));

    if (!parsed.success) {
      return NextResponse.json(fail("VALIDATION_ERROR", "Некорректные query параметры", parsed.error.flatten()), { status: 400 });
    }

    const result = await listAnime(parsed.data);
    return NextResponse.json(ok(result.items, { pagination: {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      totalPages: result.totalPages
    } }));
  } catch (error) {
    return NextResponse.json(fail("INTERNAL_ERROR", "Внутренняя ошибка", String(error)), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();

    const body = await req.json();
    const parsed = animeMutationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(fail("VALIDATION_ERROR", "Некорректные данные", parsed.error.flatten()), { status: 400 });
    }

    const anime = await prisma.anime.create({
      data: {
        title: parsed.data.title,
        synopsis: parsed.data.synopsis,
        releaseYear: parsed.data.releaseYear,
        episodes: parsed.data.episodes,
        coverImage: parsed.data.coverImage,
        avgRating: parsed.data.avgRating,
        genres: {
          create: parsed.data.genres.map((slug) => ({
            genre: {
              connect: { slug }
            }
          }))
        }
      },
      include: {
        genres: {
          include: {
            genre: true
          }
        }
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "CREATE_ANIME",
        entity: "Anime",
        entityId: anime.id,
        payload: anime
      }
    });

    return NextResponse.json(ok(anime), { status: 201 });
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json(fail("UNAUTHORIZED", "Требуется авторизация"), { status: 401 });
    }
    if ((error as Error).message === "FORBIDDEN") {
      return NextResponse.json(fail("FORBIDDEN", "Недостаточно прав"), { status: 403 });
    }
    if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
      return NextResponse.json(fail("GENRE_NOT_FOUND", "Один из жанров не найден"), { status: 400 });
    }

    return NextResponse.json(fail("INTERNAL_ERROR", "Внутренняя ошибка", String(error)), { status: 500 });
  }
}
