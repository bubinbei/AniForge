import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="space-y-6 py-10">
      <h1 className="text-4xl font-bold">AniForge</h1>
      <p className="max-w-2xl text-muted-foreground">
        Оригинальная платформа для поиска, трекинга и персональных рекомендаций по аниме с геймификацией.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h2 className="mb-2 text-lg font-semibold">Discovery</h2>
          <p className="text-sm text-muted-foreground">Каталог с фильтрами, рейтингом и карточками тайтлов.</p>
        </Card>
        <Card>
          <h2 className="mb-2 text-lg font-semibold">Tracking</h2>
          <p className="text-sm text-muted-foreground">Списки Watching/Completed/Planned/Dropped и оценка 1-10.</p>
        </Card>
        <Card>
          <h2 className="mb-2 text-lg font-semibold">AI</h2>
          <p className="text-sm text-muted-foreground">Рекомендации с пояснением причин выбора.</p>
        </Card>
      </div>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/catalog">Открыть каталог</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/register">Создать аккаунт</Link>
        </Button>
      </div>
    </div>
  );
}
