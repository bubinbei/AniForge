import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const genres = [
  ["Action", "action"],
  ["Adventure", "adventure"],
  ["Drama", "drama"],
  ["Fantasy", "fantasy"],
  ["Sci-Fi", "sci-fi"],
  ["Comedy", "comedy"],
  ["Romance", "romance"],
  ["Mystery", "mystery"],
  ["Psychological", "psychological"],
  ["Slice of Life", "slice-of-life"]
] as const;

const animeSeed = [
  ["Skyforge Chronicles", 2024, 12, ["action", "fantasy"]],
  ["Echoes of Neon", 2023, 24, ["sci-fi", "mystery"]],
  ["Petal Rewind", 2022, 12, ["romance", "drama"]],
  ["Iron Ronin Delta", 2021, 13, ["action", "sci-fi"]],
  ["Tea House Cosmos", 2020, 11, ["slice-of-life", "comedy"]],
  ["Azure Signal", 2019, 25, ["mystery", "psychological"]],
  ["Crimson Harbor", 2018, 12, ["drama", "action"]],
  ["Moonlit Algorithm", 2017, 26, ["sci-fi", "drama"]],
  ["Paper Lantern Club", 2016, 12, ["slice-of-life", "romance"]],
  ["Last Shrine Keeper", 2015, 24, ["fantasy", "adventure"]],
  ["Chrome Orchard", 2014, 13, ["sci-fi", "comedy"]],
  ["Violet Pursuit", 2013, 12, ["mystery", "romance"]],
  ["Stormcraft Academy", 2012, 24, ["fantasy", "action"]],
  ["Silent Overpass", 2011, 11, ["drama", "psychological"]],
  ["Nebula Courier", 2010, 26, ["adventure", "sci-fi"]],
  ["Arcade Monks", 2009, 12, ["comedy", "action"]],
  ["Snowline Sonata", 2008, 24, ["romance", "drama"]],
  ["Warden of Cinders", 2007, 13, ["fantasy", "mystery"]],
  ["Parallel Bento", 2006, 12, ["slice-of-life", "comedy"]],
  ["Static Pulse", 2005, 26, ["sci-fi", "action"]],
  ["Mirror District", 2004, 12, ["mystery", "psychological"]],
  ["Amber Flight", 2003, 24, ["adventure", "drama"]],
  ["Nocturne Brigade", 2002, 13, ["action", "mystery"]],
  ["Orbiting Hearts", 2001, 12, ["romance", "sci-fi"]],
  ["Village of Clocks", 2000, 24, ["slice-of-life", "fantasy"]],
  ["Signal at Dawn", 1999, 26, ["drama", "action"]],
  ["After Rain Protocol", 1998, 12, ["sci-fi", "drama"]],
  ["Rose and Voltage", 1997, 13, ["romance", "comedy"]],
  ["Fable Engine", 1996, 24, ["fantasy", "adventure"]],
  ["Whisper Casebook", 1995, 12, ["mystery", "drama"]],
  ["Glass Comet", 1994, 26, ["adventure", "sci-fi"]],
  ["Laughing Shogun", 1993, 11, ["comedy", "action"]],
  ["Gravity Theater", 1992, 12, ["psychological", "drama"]],
  ["Mosaic Garden", 1991, 24, ["slice-of-life", "romance"]],
  ["Rune Frontier", 1990, 26, ["fantasy", "action"]]
] as const;

async function main() {
  for (const [name, slug] of genres) {
    await prisma.genre.upsert({
      where: { slug },
      update: { name },
      create: { name, slug }
    });
  }

  const genreMap = new Map((await prisma.genre.findMany()).map((g) => [g.slug, g.id]));

  for (const [title, releaseYear, episodes, genreSlugs] of animeSeed) {
    const existing = await prisma.anime.findFirst({ where: { title } });
    const payload = {
      title,
      releaseYear,
      episodes,
      synopsis: `${title} — демо-описание для MVP AniForge.`,
      avgRating: Number((Math.random() * 3 + 7).toFixed(1)),
      popularityScore: Math.floor(Math.random() * 10000),
      coverImage: `https://picsum.photos/seed/${encodeURIComponent(title)}/400/600`
    };

    const anime = existing
      ? await prisma.anime.update({ where: { id: existing.id }, data: payload })
      : await prisma.anime.create({ data: payload });

    await prisma.animeGenre.deleteMany({ where: { animeId: anime.id } });

    for (const slug of genreSlugs) {
      const genreId = genreMap.get(slug);
      if (!genreId) continue;

      await prisma.animeGenre.create({
        data: {
          animeId: anime.id,
          genreId
        }
      });
    }
  }

  const achievements = [
    {
      code: "FIRST_ADD",
      name: "Первый шаг",
      description: "Добавьте первый тайтл в список",
      xpReward: 20
    },
    {
      code: "FIRST_COMPLETED",
      name: "Финишер",
      description: "Завершите первый тайтл",
      xpReward: 30
    },
    {
      code: "RATER_10",
      name: "Критик",
      description: "Поставьте оценку 10",
      xpReward: 15
    }
  ] as const;

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { code: achievement.code },
      update: {
        name: achievement.name,
        description: achievement.description,
        xpReward: achievement.xpReward
      },
      create: achievement
    });
  }

  if (process.env.ADMIN_EMAIL) {
    await prisma.user.updateMany({
      where: { email: process.env.ADMIN_EMAIL },
      data: { role: "ADMIN" }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    // Комментарий: для MVP логируем ошибку и выходим с кодом 1.
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
