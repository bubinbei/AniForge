import { prisma } from "@/lib/db/prisma";

type RecommendationItem = {
  anime: {
    id: string;
    title: string;
    synopsis: string;
    releaseYear: number;
    avgRating: number;
    popularityScore: number;
    coverImage: string | null;
    genres: Array<{ genre: { id: string; name: string; slug: string } }>;
  };
  score: number;
  reason: string;
};

type RecommendationResult = {
  recommendations: RecommendationItem[];
  dailyPicks: RecommendationItem[];
  profileSignals: {
    favoriteGenres: string[];
    topRatedTitles: string[];
  };
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export async function getRecommendationsForUser(userId: string): Promise<RecommendationResult> {
  const userList = await prisma.userAnimeList.findMany({
    where: { userId },
    include: {
      anime: {
        include: {
          genres: {
            include: { genre: true }
          }
        }
      }
    }
  });

  const excludedAnimeIds = userList.map((item) => item.animeId);

  const ratedItems = userList
    .filter((item) => item.rating !== null)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  const topRatedTitles = ratedItems.slice(0, 3).map((item) => item.anime.title);

  const genreScores = new Map<string, { score: number; name: string }>();
  for (const item of userList) {
    const ratingWeight = item.rating ? item.rating / 10 : 0.45;
    const statusWeight = item.status === "COMPLETED" ? 1.2 : item.status === "WATCHING" ? 1.0 : 0.8;

    for (const link of item.anime.genres) {
      const prev = genreScores.get(link.genre.slug);
      const nextScore = (prev?.score ?? 0) + ratingWeight * statusWeight;
      genreScores.set(link.genre.slug, { score: nextScore, name: link.genre.name });
    }
  }

  const sortedGenres = [...genreScores.entries()].sort((a, b) => b[1].score - a[1].score);
  const favoriteGenreSlugs = sortedGenres.slice(0, 5).map(([slug]) => slug);
  const favoriteGenres = sortedGenres.slice(0, 3).map(([, value]) => value.name);

  const candidateWhere = favoriteGenreSlugs.length
    ? {
        id: { notIn: excludedAnimeIds },
        genres: {
          some: {
            genre: {
              slug: { in: favoriteGenreSlugs }
            }
          }
        }
      }
    : {
        id: { notIn: excludedAnimeIds }
      };

  const candidates = await prisma.anime.findMany({
    where: candidateWhere,
    include: {
      genres: {
        include: { genre: true }
      }
    },
    orderBy: [{ avgRating: "desc" }, { popularityScore: "desc" }],
    take: 40
  });

  const scored: RecommendationItem[] = candidates.map((anime) => {
    const animeGenreSlugs = anime.genres.map((link) => link.genre.slug);
    const matchedGenres = anime.genres
      .filter((link) => favoriteGenreSlugs.includes(link.genre.slug))
      .map((link) => link.genre.name);

    const genreScore = animeGenreSlugs.reduce((sum, slug) => sum + (genreScores.get(slug)?.score ?? 0), 0);
    const ratingScore = anime.avgRating;
    const popularityScore = clamp(anime.popularityScore / 1000, 0, 10);

    const totalScore = genreScore * 1.5 + ratingScore * 1.2 + popularityScore * 0.5;

    const reasonParts: string[] = [];
    if (matchedGenres.length) {
      reasonParts.push(`похож по жанрам: ${matchedGenres.slice(0, 2).join(", ")}`);
    }
    if (topRatedTitles.length) {
      reasonParts.push(`у вас высокие оценки у: ${topRatedTitles.slice(0, 2).join(", ")}`);
    }
    if (!reasonParts.length) {
      reasonParts.push("подходит по общему профилю предпочтений");
    }

    return {
      anime,
      score: Number(totalScore.toFixed(2)),
      reason: `Рекомендовано: ${reasonParts.join("; ")}`
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const recommendations = scored.slice(0, 12);
  const dailyPicks = recommendations.slice(0, 3);

  return {
    recommendations,
    dailyPicks,
    profileSignals: {
      favoriteGenres,
      topRatedTitles
    }
  };
}
