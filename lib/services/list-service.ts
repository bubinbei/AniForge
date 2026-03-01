import { prisma } from "@/lib/db/prisma";
import { applyListGamification } from "@/lib/services/gamification-service";

export async function upsertUserAnime(params: {
  userId: string;
  animeId: string;
  status: "WATCHING" | "COMPLETED" | "PLANNED" | "DROPPED";
  rating?: number;
}) {
  const user = await prisma.user.findUnique({ where: { id: params.userId }, select: { plan: true } });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const before = await prisma.userAnimeList.findUnique({
    where: {
      userId_animeId: {
        userId: params.userId,
        animeId: params.animeId
      }
    }
  });

  if (user.plan === "FREE") {
    const count = await prisma.userAnimeList.count({ where: { userId: params.userId } });

    if (!before && count >= 10) {
      throw new Error("FREE_PLAN_LIMIT");
    }
  }

  const after = await prisma.userAnimeList.upsert({
    where: {
      userId_animeId: {
        userId: params.userId,
        animeId: params.animeId
      }
    },
    update: {
      status: params.status,
      rating: params.rating
    },
    create: {
      userId: params.userId,
      animeId: params.animeId,
      status: params.status,
      rating: params.rating
    }
  });

  const gamification = await applyListGamification({
    userId: params.userId,
    before,
    after
  });

  return {
    item: after,
    gamification
  };
}

export async function getUserList(userId: string) {
  const items = await prisma.userAnimeList.findMany({
    where: { userId },
    include: {
      anime: {
        include: {
          genres: {
            include: {
              genre: true
            }
          }
        }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return {
    WATCHING: items.filter((it) => it.status === "WATCHING"),
    COMPLETED: items.filter((it) => it.status === "COMPLETED"),
    PLANNED: items.filter((it) => it.status === "PLANNED"),
    DROPPED: items.filter((it) => it.status === "DROPPED")
  };
}
