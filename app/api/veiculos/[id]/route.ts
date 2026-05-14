import { NextResponse } from "next/server";
import { rateLimitOrThrow } from "@/lib/rate-limit";
import { getVehiclesCached } from "@/lib/vehicle-cache";

export const dynamic = "force-dynamic";

export async function GET(request: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    rateLimitOrThrow(request.headers);
  } catch {
    return NextResponse.json({ error: "Muitas requisições. Tente novamente em instantes." }, { status: 429 });
  }
  const { id: raw } = await ctx.params;
  const id = decodeURIComponent(raw);
  try {
    const { veiculos, fetchedAt, origem } = await getVehiclesCached();
    const veiculo =
      veiculos.find((v) => v.id === id) ||
      veiculos.find((v) => v.slug === id) ||
      null;
    if (!veiculo) {
      return NextResponse.json(
        { veiculo: null, atualizadoEm: new Date(fetchedAt).toISOString(), origem },
        { status: 404 },
      );
    }
    return NextResponse.json({
      veiculo,
      atualizadoEm: new Date(fetchedAt).toISOString(),
      origem,
    });
  } catch {
    return NextResponse.json({ error: "Não foi possível carregar o veículo." }, { status: 500 });
  }
}
