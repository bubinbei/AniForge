import { prisma } from "@/lib/db/prisma";

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

  if (user.plan === "FREE") {
    const count = await prisma.userAnimeList.count({ where: { userId: params.userId } });
    const exists = await prisma.userAnimeList.findUnique({
      where: {
        userId_animeId: {
          userId: params.userId,
          animeId: params.animeId
        }
      }
    });

    if (!exists && count >= 10) {
      throw new Error("FREE_PLAN_LIMIT");
    }
  }

  return prisma.userAnimeList.upsert({
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
