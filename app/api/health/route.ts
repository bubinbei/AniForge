import { NextResponse } from "next/server";

import { ok } from "@/lib/utils/api-response";

const startedAt = Date.now();

export async function GET() {
  return NextResponse.json(
    ok({
      status: "ok",
      uptime: Math.floor((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString()
    })
  );
}
