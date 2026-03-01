"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getListStatusLabel, LIST_STATUS_OPTIONS, type ListStatus } from "@/lib/utils/list-status";

type ListItem = {
  animeId: string;
  status: ListStatus;
  rating: number | null;
  anime: { title: string };
};

type GroupedList = Record<string, ListItem[]>;

type ItemEditorState = {
  status: ListStatus;
  rating: string;
};

function toMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Операция не выполнена";
}

export default function MyListPage() {
  const queryClient = useQueryClient();
  const [editor, setEditor] = useState<Record<string, ItemEditorState>>({});
  const [message, setMessage] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-list"],
    queryFn: async () => {
      const res = await fetch("/api/list", { cache: "no-store" });
      const payload = await res.json();
      if (!res.ok || !payload.success) {
        throw new Error(payload?.error?.message ?? "Ошибка загрузки списка");
      }
      return payload.data as GroupedList;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (params: { animeId: string; status: ListStatus; rating?: number }) => {
      const res = await fetch(`/api/list/${params.animeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: params.status, rating: params.rating })
      });
      const payload = await res.json();
      if (!res.ok || !payload.success) {
        throw new Error(payload?.error?.message ?? "Не удалось обновить элемент");
      }
      return payload;
    },
    onSuccess: () => {
      setMessage("Изменения сохранены");
      queryClient.invalidateQueries({ queryKey: ["my-list"] });
    },
    onError: (error) => {
      setMessage(toMessage(error));
    }
  });

  const removeMutation = useMutation({
    mutationFn: async (animeId: string) => {
      const res = await fetch(`/api/list/${animeId}`, { method: "DELETE" });
      const payload = await res.json();
      if (!res.ok || !payload.success) {
        throw new Error(payload?.error?.message ?? "Не удалось удалить элемент");
      }
      return payload;
    },
    onSuccess: () => {
      setMessage("Тайтл удален");
      queryClient.invalidateQueries({ queryKey: ["my-list"] });
    },
    onError: (error) => {
      setMessage(toMessage(error));
    }
  });

  function getEditorState(item: ListItem): ItemEditorState {
    const current = editor[item.animeId];
    if (current) {
      return current;
    }

    return {
      status: item.status,
      rating: item.rating ? String(item.rating) : ""
    };
  }

  if (isLoading) return <p>Загрузка...</p>;
  if (isError || !data) return <p>Ошибка загрузки списка</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Мой список</h1>
      {message ? <p className="rounded-md border border-border bg-card/60 px-3 py-2 text-sm">{message}</p> : null}

      {Object.entries(data).map(([status, items]) => (
        <section key={status} className="space-y-2">
          <h2 className="text-lg font-semibold">{getListStatusLabel(status)}</h2>
          {items.length === 0 ? <p className="text-sm text-muted-foreground">Пусто</p> : null}

          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => {
              const state = getEditorState(item);
              const pending = saveMutation.isPending || removeMutation.isPending;

              return (
                <Card key={item.animeId} className="space-y-3">
                  <div className="font-medium">{item.anime.title}</div>

                  <div className="grid gap-2 md:grid-cols-2">
                    <label className="text-sm">
                      <span className="mb-1 block text-muted-foreground">Статус</span>
                      <select
                        className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
                        value={state.status}
                        onChange={(e) => {
                          setEditor((prev) => ({
                            ...prev,
                            [item.animeId]: {
                              ...state,
                              status: e.target.value as ListStatus
                            }
                          }));
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
                      <span className="mb-1 block text-muted-foreground">Оценка</span>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={state.rating}
                        onChange={(e) => {
                          setEditor((prev) => ({
                            ...prev,
                            [item.animeId]: {
                              ...state,
                              rating: e.target.value
                            }
                          }));
                        }}
                        placeholder="1-10"
                      />
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      disabled={pending}
                      onClick={() => {
                        const rating = state.rating ? Number(state.rating) : undefined;
                        saveMutation.mutate({ animeId: item.animeId, status: state.status, rating });
                      }}
                    >
                      Сохранить
                    </Button>

                    <Button disabled={pending} variant="outline" onClick={() => removeMutation.mutate(item.animeId)}>
                      Удалить
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
