import { auth } from "@/auth";
import { RecommendationsPanel } from "@/components/anime/recommendations-panel";
import { Card } from "@/components/ui/card";
import { getProfile } from "@/lib/services/user-service";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <p>Профиль недоступен.</p>;
  }

  const profile = await getProfile(session.user.id);

  if (!profile) {
    return <p>Профиль недоступен.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Профиль</h1>
        <Card className="space-y-2">
          <div>Email: {profile.email}</div>
          <div>Имя: {profile.name || "-"}</div>
          <div>Роль: {profile.role}</div>
          <div>План: {profile.plan}</div>
          <div>Уровень: {profile.level}</div>
          <div>XP: {profile.xp}</div>
          <div>Достижений: {profile._count.achievements}</div>
          <div>Тайтлов в списке: {profile._count.animeList}</div>
        </Card>
      </div>

      <RecommendationsPanel />
    </div>
  );
}
