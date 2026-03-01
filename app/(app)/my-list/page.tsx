"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type GroupedList = Record<string, Array<{ animeId: string; status: string; rating: number | null; anime: { title: string } }>>;

export default function MyListPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-list"],
    queryFn: async () => {
      const res = await fetch("/api/list");
      return res.json();
    }
  });

  const removeMutation = useMutation({
    mutationFn: async (animeId: string) => {
      const res = await fetch(`/api/list/${animeId}`, { method: "DELETE" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-list"] });
    }
  });

  if (isLoading) return <p>Загрузка...</p>;
  if (isError || !data?.success) return <p>Ошибка загрузки списка</p>;

  const grouped: GroupedList = data.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Мой список</h1>
      {Object.entries(grouped).map(([status, items]) => (
        <section key={status} className="space-y-2">
          <h2 className="text-lg font-semibold">{status}</h2>
          {items.length === 0 ? <p className="text-sm text-muted-foreground">Пусто</p> : null}
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <Card key={item.animeId} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{item.anime.title}</div>
                  <div className="text-sm text-muted-foreground">Оценка: {item.rating ?? "-"}</div>
                </div>
                <Button variant="outline" onClick={() => removeMutation.mutate(item.animeId)}>
                  Удалить
                </Button>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
