import { Card } from "@/components/ui/card";

export function AnimeCard({
  anime
}: {
  anime: {
    id: string;
    title: string;
    synopsis: string;
    releaseYear: number;
    avgRating: number;
    coverImage?: string | null;
    genres?: { genre: { name: string } }[];
  };
}) {
  return (
    <Card className="flex h-full flex-col gap-3">
      <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-muted">
        {anime.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={anime.coverImage} alt={anime.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No Cover</div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="line-clamp-1 text-base font-semibold">{anime.title}</h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">{anime.synopsis}</p>
      </div>
      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
        <span>{anime.releaseYear}</span>
        <span>⭐ {anime.avgRating.toFixed(1)}</span>
      </div>
    </Card>
  );
}
