"use client";

import { Input } from "@/components/ui/input";

export function FiltersPanel({
  minRating,
  yearFrom,
  onMinRating,
  onYearFrom
}: {
  minRating: string;
  yearFrom: string;
  onMinRating: (v: string) => void;
  onYearFrom: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Input placeholder="Мин. рейтинг (0-10)" value={minRating} onChange={(e) => onMinRating(e.target.value)} />
      <Input placeholder="Год от" value={yearFrom} onChange={(e) => onYearFrom(e.target.value)} />
    </div>
  );
}
