import type { Vehicle } from "@/types/vehicle";
import { fetchVehiclesFromAutocerto } from "@/lib/xml-client";

const TTL_MS = 10 * 60 * 1000;

type CacheEntry = {
  veiculos: Vehicle[];
  fetchedAt: number;
};

let memory: CacheEntry | null = null;
let inflight: Promise<Vehicle[]> | null = null;

export type CacheOrigin = "live" | "cache" | "fallback";

export async function getVehiclesCached(): Promise<{
  veiculos: Vehicle[];
  fetchedAt: number;
  origem: CacheOrigin;
}> {
  const now = Date.now();
  if (memory && now - memory.fetchedAt < TTL_MS) {
    return { veiculos: memory.veiculos, fetchedAt: memory.fetchedAt, origem: "cache" };
  }
  if (!inflight) {
    inflight = (async () => {
      try {
        return await fetchVehiclesFromAutocerto();
      } finally {
        inflight = null;
      }
    })();
  }
  try {
    const veiculos = await inflight;
    memory = { veiculos, fetchedAt: Date.now() };
    return { veiculos, fetchedAt: memory.fetchedAt, origem: "live" };
  } catch {
    if (memory) {
      return { veiculos: memory.veiculos, fetchedAt: memory.fetchedAt, origem: "fallback" };
    }
    return { veiculos: [], fetchedAt: Date.now(), origem: "fallback" };
  }
}

export function getStaleVehiclesIfAny(): Vehicle[] | null {
  return memory?.veiculos ?? null;
}
