"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { AnimeCard } from "@/components/anime/anime-card";
import { FiltersPanel } from "@/components/anime/filters-panel";
import { Pagination } from "@/components/anime/pagination";
import { SearchBar } from "@/components/anime/search-bar";
import { AnimeGridSkeleton } from "@/components/shared/skeletons";

type AnimeItem = {
  id: string;
  title: string;
  synopsis: string;
  releaseYear: number;
  avgRating: number;
  coverImage?: string | null;
  genres?: { genre: { name: string } }[];
};

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [page, setPage] = useState(1);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", "12");
    if (search) params.set("search", search);
    if (minRating) params.set("minRating", minRating);
    if (yearFrom) params.set("yearFrom", yearFrom);
    return params.toString();
  }, [page, search, minRating, yearFrom]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["catalog", query],
    queryFn: async () => {
      const res = await fetch(`/api/anime?${query}`);
      return res.json();
    }
  });

  const items: AnimeItem[] = data?.data ?? [];
  const totalPages = (data?.meta?.pagination?.totalPages as number | undefined) ?? 1;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Каталог</h1>
      <SearchBar value={search} onChange={(v) => { setPage(1); setSearch(v); }} />
      <FiltersPanel
        minRating={minRating}
        yearFrom={yearFrom}
        onMinRating={(v) => { setPage(1); setMinRating(v); }}
        onYearFrom={(v) => { setPage(1); setYearFrom(v); }}
      />

      {isLoading ? <AnimeGridSkeleton /> : null}
      {isError ? <p className="text-red-400">Ошибка загрузки каталога</p> : null}
      {!isLoading && !isError && items.length === 0 ? <p className="text-muted-foreground">Ничего не найдено.</p> : null}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((anime) => (
          <Link key={anime.id} href={`/anime/${anime.id}`}>
            <AnimeCard anime={anime} />
          </Link>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
