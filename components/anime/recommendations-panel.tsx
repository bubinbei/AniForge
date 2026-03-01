"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";

type Recommendation = {
  anime: {
    id: string;
    title: string;
    avgRating: number;
    releaseYear: number;
    coverImage: string | null;
    genres: Array<{ genre: { id: string; name: string } }>;
  };
  score: number;
  reason: string;
};

type RecommendationsPayload = {
  recommendations: Recommendation[];
  dailyPicks: Recommendation[];
  profileSignals: {
    favoriteGenres: string[];
    topRatedTitles: string[];
  };
};

export function RecommendationsPanel() {
  const query = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const res = await fetch("/api/recommendations", { cache: "no-store" });
      const payload = await res.json();

      if (!res.ok || !payload.success) {
        throw new Error(payload?.error?.message ?? "Не удалось загрузить рекомендации");
      }

      return payload.data as RecommendationsPayload;
    }
  });

  if (query.isLoading) {
    return <p className="text-sm text-muted-foreground">Загружаем рекомендации...</p>;
  }

  if (query.isError) {
    return <p className="text-sm text-red-400">Не удалось загрузить рекомендации</p>;
  }

  const data = query.data;
  if (!data) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Рекомендации для вас</h2>
        <p className="text-sm text-muted-foreground">
          Любимые жанры: {data.profileSignals.favoriteGenres.join(", ") || "пока собираем профиль"}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {data.dailyPicks.map((item) => (
          <Card key={item.anime.id} className="space-y-2">
            <div className="text-xs text-primary">Daily pick</div>
            <Link className="block text-base font-semibold hover:underline" href={`/anime/${item.anime.id}`}>
              {item.anime.title}
            </Link>
            <p className="text-xs text-muted-foreground">{item.reason}</p>
            <div className="text-xs text-muted-foreground">
              ⭐ {item.anime.avgRating.toFixed(1)} • Score {item.score.toFixed(1)}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {data.recommendations.slice(0, 6).map((item) => (
          <Card key={item.anime.id} className="space-y-2">
            <Link className="block text-base font-semibold hover:underline" href={`/anime/${item.anime.id}`}>
              {item.anime.title}
            </Link>
            <p className="text-xs text-muted-foreground">{item.reason}</p>
            <div className="text-xs text-muted-foreground">
              {item.anime.releaseYear} • ⭐ {item.anime.avgRating.toFixed(1)} • Score {item.score.toFixed(1)}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
