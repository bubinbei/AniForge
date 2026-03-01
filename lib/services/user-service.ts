import { prisma } from "@/lib/db/prisma";

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      plan: true,
      xp: true,
      level: true,
      _count: {
        select: {
          animeList: true,
          achievements: true
        }
      }
    }
  });

  return user;
}
