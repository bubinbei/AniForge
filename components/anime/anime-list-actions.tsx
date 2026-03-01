"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LIST_STATUS_OPTIONS, type ListStatus } from "@/lib/utils/list-status";

type ListItem = {
  animeId: string;
  status: ListStatus;
  rating: number | null;
};

type GroupedList = Record<string, ListItem[]>;

function toMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Не удалось обновить список";
}

export function AnimeListActions({ animeId }: { animeId: string }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ListStatus>("PLANNED");
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");

  const listQuery = useQuery({
    queryKey: ["my-list"],
    queryFn: async () => {
      const res = await fetch("/api/list", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message ?? "Не удалось загрузить список");
      }
      return data.data as GroupedList;
    }
  });

  const existing = useMemo(() => {
    if (!listQuery.data) return null;
    const merged = Object.values(listQuery.data).flat();
    return merged.find((item) => item.animeId === animeId) ?? null;
  }, [listQuery.data, animeId]);

  useEffect(() => {
    if (!existing) return;
    setStatus(existing.status);
    setRating(existing.rating ? String(existing.rating) : "");
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: async (payload: { status: ListStatus; rating?: number }) => {
      const res = await fetch(`/api/list/${animeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message ?? "Не удалось сохранить изменения");
      }

      return data;
    },
    onSuccess: () => {
      setMessage("Список обновлен");
      queryClient.invalidateQueries({ queryKey: ["my-list"] });
    },
    onError: (error) => {
      setMessage(toMessage(error));
    }
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/list/${animeId}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message ?? "Не удалось удалить тайтл");
      }

      return data;
    },
    onSuccess: () => {
      setMessage("Тайтл удален из списка");
      queryClient.invalidateQueries({ queryKey: ["my-list"] });
    },
    onError: (error) => {
      setMessage(toMessage(error));
    }
  });

  const isLoading = saveMutation.isPending || removeMutation.isPending || listQuery.isLoading;

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card/60 p-4">
      <h2 className="text-lg font-semibold">Мой список</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block text-muted-foreground">Статус</span>
          <select
            className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as ListStatus);
            }}
          >
            {LIST_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-muted-foreground">Оценка (1-10)</span>
          <Input
            type="number"
            min={1}
            max={10}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="Опционально"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          disabled={isLoading}
          onClick={() => {
            const numericRating = rating ? Number(rating) : undefined;
            saveMutation.mutate({ status: status ?? "PLANNED", rating: numericRating });
          }}
        >
          {existing ? "Обновить" : "Добавить в список"}
        </Button>
        {existing ? (
          <Button disabled={isLoading} variant="outline" onClick={() => removeMutation.mutate()}>
            Удалить из списка
          </Button>
        ) : null}
      </div>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      {listQuery.isError ? <p className="text-sm text-red-400">Не удалось загрузить ваш список</p> : null}
    </div>
  );
}
