import { ListStatus, type UserAnimeList } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

type GamificationEvent = {
  gainedXp: number;
  unlocked: string[];
};

function calculateLevel(xp: number): number {
  // Комментарий: простая формула уровня для MVP, позже можно вынести в конфиг.
  return Math.max(1, Math.floor(xp / 100) + 1);
}

async function grantXp(userId: string, amount: number) {
  if (amount <= 0) {
    return;
  }

  const current = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true }
  });

  if (!current) {
    return;
  }

  const nextXp = current.xp + amount;
  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: nextXp,
      level: calculateLevel(nextXp)
    }
  });
}

async function tryUnlockAchievement(userId: string, code: string): Promise<number> {
  const achievement = await prisma.achievement.findUnique({ where: { code } });
  if (!achievement) {
    return 0;
  }

  const existing = await prisma.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId: achievement.id
      }
    }
  });

  if (existing) {
    return 0;
  }

  await prisma.userAchievement.create({
    data: {
      userId,
      achievementId: achievement.id
    }
  });

  return achievement.xpReward;
}

export async function applyListGamification(params: {
  userId: string;
  before: UserAnimeList | null;
  after: UserAnimeList;
}): Promise<GamificationEvent> {
  let gainedXp = 0;
  const unlocked: string[] = [];

  const isNewItem = !params.before;
  const movedToCompleted =
    params.after.status === ListStatus.COMPLETED && params.before?.status !== ListStatus.COMPLETED;
  const gotTopRating = params.after.rating === 10 && params.before?.rating !== 10;

  if (isNewItem) {
    gainedXp += 10;
    const rewardXp = await tryUnlockAchievement(params.userId, "FIRST_ADD");
    if (rewardXp > 0) {
      gainedXp += rewardXp;
      unlocked.push("FIRST_ADD");
    }
  }

  if (movedToCompleted) {
    gainedXp += 20;
    const rewardXp = await tryUnlockAchievement(params.userId, "FIRST_COMPLETED");
    if (rewardXp > 0) {
      gainedXp += rewardXp;
      unlocked.push("FIRST_COMPLETED");
    }
  }

  if (gotTopRating) {
    gainedXp += 5;
    const rewardXp = await tryUnlockAchievement(params.userId, "RATER_10");
    if (rewardXp > 0) {
      gainedXp += rewardXp;
      unlocked.push("RATER_10");
    }
  }

  await grantXp(params.userId, gainedXp);

  return {
    gainedXp,
    unlocked
  };
}
