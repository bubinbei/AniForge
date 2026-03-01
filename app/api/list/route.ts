import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/guards";
import { getUserList } from "@/lib/services/list-service";
import { fail, ok } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const user = await requireUser();
    const list = await getUserList(user.id);

    return NextResponse.json(ok(list));
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json(fail("UNAUTHORIZED", "Требуется авторизация"), { status: 401 });
    }

    return NextResponse.json(fail("INTERNAL_ERROR", "Внутренняя ошибка", String(error)), { status: 500 });
  }
}
