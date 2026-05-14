import { NextResponse } from "next/server";
import { rateLimitOrThrow } from "@/lib/rate-limit";
import { getVehiclesCached } from "@/lib/vehicle-cache";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    rateLimitOrThrow(request.headers);
  } catch {
    return NextResponse.json({ error: "Muitas requisições. Tente novamente em instantes." }, { status: 429 });
  }
  try {
    const { veiculos, fetchedAt, origem } = await getVehiclesCached();
    return NextResponse.json({
      veiculos,
      atualizadoEm: new Date(fetchedAt).toISOString(),
      origem,
    });
  } catch {
    return NextResponse.json({ error: "Não foi possível carregar o estoque." }, { status: 500 });
  }
}
