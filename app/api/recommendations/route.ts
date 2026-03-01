import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/guards";
import { getRecommendationsForUser } from "@/lib/services/recommendation-service";
import { fail, ok } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const user = await requireUser();
    const recommendations = await getRecommendationsForUser(user.id);

    return NextResponse.json(ok(recommendations));
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json(fail("UNAUTHORIZED", "Требуется авторизация"), { status: 401 });
    }

    return NextResponse.json(fail("INTERNAL_ERROR", "Внутренняя ошибка", String(error)), { status: 500 });
  }
}
