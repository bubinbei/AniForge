"use client";

import { FormEvent, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState("2024");
  const [episodes, setEpisodes] = useState("12");
  const [synopsis, setSynopsis] = useState("");
  const [genres, setGenres] = useState("action");

  const { data } = useQuery({
    queryKey: ["admin-anime"],
    queryFn: async () => {
      const res = await fetch("/api/anime?page=1&pageSize=20");
      return res.json();
    }
  });

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/anime", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        releaseYear: Number(releaseYear),
        episodes: Number(episodes),
        synopsis,
        genres: genres.split(",").map((v) => v.trim()).filter(Boolean),
        avgRating: 0
      })
    });

    setTitle("");
    setSynopsis("");
    queryClient.invalidateQueries({ queryKey: ["admin-anime"] });
  }

  async function onDelete(id: string) {
    await fetch(`/api/anime/${id}`, { method: "DELETE" });
    queryClient.invalidateQueries({ queryKey: ["admin-anime"] });
  }

  const items = data?.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Админ панель</h1>

      <Card>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={onCreate}>
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input placeholder="Release year" value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} required />
          <Input placeholder="Episodes" value={episodes} onChange={(e) => setEpisodes(e.target.value)} required />
          <Input placeholder="Genres slugs: action,drama" value={genres} onChange={(e) => setGenres(e.target.value)} required />
          <div className="md:col-span-2">
            <Input placeholder="Synopsis" value={synopsis} onChange={(e) => setSynopsis(e.target.value)} required />
          </div>
          <Button type="submit" className="md:col-span-2">
            Создать
          </Button>
        </form>
      </Card>

      <div className="grid gap-2">
        {items.map((item: { id: string; title: string; releaseYear: number }) => (
          <Card key={item.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.releaseYear}</div>
            </div>
            <Button variant="outline" onClick={() => onDelete(item.id)}>
              Удалить
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
