import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { getAnimeById } from "@/lib/services/anime-service";
import { fail, ok } from "@/lib/utils/api-response";
import { animeMutationSchema } from "@/lib/validators/anime";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const anime = await getAnimeById(params.id);
    if (!anime) {
      return NextResponse.json(fail("NOT_FOUND", "Аниме не найдено"), { status: 404 });
    }

    return NextResponse.json(ok(anime));
  } catch (error) {
    return NextResponse.json(fail("INTERNAL_ERROR", "Внутренняя ошибка", String(error)), { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();

    const body = await req.json();
    const parsed = animeMutationSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(fail("VALIDATION_ERROR", "Некорректные данные", parsed.error.flatten()), { status: 400 });
    }

    const data: Record<string, unknown> = {
      ...(parsed.data.title ? { title: parsed.data.title } : {}),
      ...(parsed.data.synopsis ? { synopsis: parsed.data.synopsis } : {}),
      ...(parsed.data.releaseYear ? { releaseYear: parsed.data.releaseYear } : {}),
      ...(parsed.data.episodes ? { episodes: parsed.data.episodes } : {}),
      ...(parsed.data.coverImage ? { coverImage: parsed.data.coverImage } : {}),
      ...(parsed.data.avgRating !== undefined ? { avgRating: parsed.data.avgRating } : {})
    };

    if (parsed.data.genres) {
      await prisma.animeGenre.deleteMany({ where: { animeId: params.id } });
      data.genres = {
        create: parsed.data.genres.map((slug) => ({
          genre: {
            connect: { slug }
          }
        }))
      };
    }

    const anime = await prisma.anime.update({
      where: { id: params.id },
      data,
      include: {
        genres: {
          include: {
            genre: true
          }
        }
      }
    });

    return NextResponse.json(ok(anime));
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json(fail("UNAUTHORIZED", "Требуется авторизация"), { status: 401 });
    }
    if ((error as Error).message === "FORBIDDEN") {
      return NextResponse.json(fail("FORBIDDEN", "Недостаточно прав"), { status: 403 });
    }
    if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
      return NextResponse.json(fail("NOT_FOUND", "Аниме или жанр не найден"), { status: 404 });
    }

    return NextResponse.json(fail("INTERNAL_ERROR", "Внутренняя ошибка", String(error)), { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await prisma.anime.delete({ where: { id: params.id } });

    return NextResponse.json(ok({ deleted: true }));
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json(fail("UNAUTHORIZED", "Требуется авторизация"), { status: 401 });
    }
    if ((error as Error).message === "FORBIDDEN") {
      return NextResponse.json(fail("FORBIDDEN", "Недостаточно прав"), { status: 403 });
    }

    return NextResponse.json(fail("INTERNAL_ERROR", "Внутренняя ошибка", String(error)), { status: 500 });
  }
}
