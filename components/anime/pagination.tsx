"use client";

import { Button } from "@/components/ui/button";

export function Pagination({
  page,
  totalPages,
  onPageChange
}: {
  page: number;
  totalPages: number;
  onPageChange: (next: number) => void;
}) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <Button variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Назад
      </Button>
      <span className="text-sm text-muted-foreground">
        {page} / {Math.max(1, totalPages)}
      </span>
      <Button variant="outline" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Вперед
      </Button>
    </div>
  );
}
