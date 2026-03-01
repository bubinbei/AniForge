import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { upsertUserAnime } from "@/lib/services/list-service";
import { fail, ok } from "@/lib/utils/api-response";
import { userListMutationSchema } from "@/lib/validators/list";

export async function POST(req: Request, { params }: { params: { animeId: string } }) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const parsed = userListMutationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(fail("VALIDATION_ERROR", "Некорректные данные", parsed.error.flatten()), { status: 400 });
    }

    const result = await upsertUserAnime({
      userId: user.id,
      animeId: params.animeId,
      status: parsed.data.status,
      rating: parsed.data.rating
    });

    return NextResponse.json(ok(result.item, { gamification: result.gamification }));
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json(fail("UNAUTHORIZED", "Требуется авторизация"), { status: 401 });
    }

    if ((error as Error).message === "FREE_PLAN_LIMIT") {
      return NextResponse.json(fail("FREE_PLAN_LIMIT", "Лимит FREE плана: 10 тайтлов"), { status: 403 });
    }

    return NextResponse.json(fail("INTERNAL_ERROR", "Внутренняя ошибка", String(error)), { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { animeId: string } }) {
  try {
    const user = await requireUser();

    await prisma.userAnimeList.delete({
      where: {
        userId_animeId: {
          userId: user.id,
          animeId: params.animeId
        }
      }
    });

    return NextResponse.json(ok({ deleted: true }));
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json(fail("UNAUTHORIZED", "Требуется авторизация"), { status: 401 });
    }

    if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
      return NextResponse.json(fail("NOT_FOUND", "Элемент списка не найден"), { status: 404 });
    }

    return NextResponse.json(fail("INTERNAL_ERROR", "Внутренняя ошибка", String(error)), { status: 500 });
  }
}
