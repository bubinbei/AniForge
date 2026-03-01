"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl space-y-3 p-8">
      <h2 className="text-2xl font-semibold">Что-то пошло не так</h2>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <button className="rounded-md border border-border px-3 py-2" onClick={reset}>
        Повторить
      </button>
    </div>
  );
}
