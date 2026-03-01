import Link from "next/link";

import { AnimeListActions } from "@/components/anime/anime-list-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAnimeById } from "@/lib/services/anime-service";

export default async function AnimeDetailPage({ params }: { params: { id: string } }) {
  const anime = await getAnimeById(params.id);

  if (!anime) {
    return <p>Тайтл не найден.</p>;
  }

  return (
    <div className="space-y-4">
      <Button asChild variant="outline">
        <Link href="/catalog">Назад в каталог</Link>
      </Button>
      <Card className="grid gap-4 md:grid-cols-[220px_1fr]">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-muted">
          {anime.coverImage ? (
            // Комментарий: в MVP используем img для простоты.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={anime.coverImage} alt={anime.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No Cover</div>
          )}
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">{anime.title}</h1>
          <p className="text-muted-foreground">{anime.synopsis}</p>
          <div className="text-sm text-muted-foreground">Год: {anime.releaseYear}</div>
          <div className="text-sm text-muted-foreground">Эпизоды: {anime.episodes}</div>
          <div className="text-sm text-muted-foreground">Рейтинг: {anime.avgRating.toFixed(1)}</div>
          <div className="flex flex-wrap gap-2">
            {anime.genres.map((g: { genre: { id: string; name: string } }) => (
              <span key={g.genre.id} className="rounded-full border border-border px-2 py-1 text-xs">
                {g.genre.name}
              </span>
            ))}
          </div>
        </div>
      </Card>

      <AnimeListActions animeId={anime.id} />
    </div>
  );
}
