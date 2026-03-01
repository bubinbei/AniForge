import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

import { prisma } from "@/lib/db/prisma";
import { registerSchema } from "@/lib/validators/auth";
import { fail, ok } from "@/lib/utils/api-response";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(fail("VALIDATION_ERROR", "Некорректные данные", parsed.error.flatten()), { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (exists) {
      return NextResponse.json(fail("EMAIL_TAKEN", "Email уже используется"), { status: 409 });
    }

    const passwordHash = await hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        passwordHash,
        role: "USER",
        plan: "FREE"
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    return NextResponse.json(ok(user), { status: 201 });
  } catch (error) {
    return NextResponse.json(fail("INTERNAL_ERROR", "Внутренняя ошибка", String(error)), { status: 500 });
  }
}
