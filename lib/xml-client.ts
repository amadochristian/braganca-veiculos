import { XMLParser } from "fast-xml-parser";
import { vehiclesFromParsedXml } from "@/lib/normalize-vehicle";
import type { Vehicle } from "@/types/vehicle";
import { env } from "@/lib/env";

const FETCH_TIMEOUT_MS = 25_000;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
  parseTagValue: false,
  cdataPropName: "__cdata",
  isArray: (name) =>
    ["Anuncio", "anuncio", "Veiculo", "veiculo", "Foto", "foto", "Opcional", "opcional"].includes(
      name,
    ),
});

export async function fetchVehiclesFromAutocerto(): Promise<Vehicle[]> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(env.autocertoXmlUrl, {
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "application/xml,text/xml,*/*" },
    });
    if (!res.ok) throw new Error(`XML HTTP ${res.status}`);
    const xml = await res.text();
    const parsed = parser.parse(xml);
    return vehiclesFromParsedXml(parsed);
  } finally {
    clearTimeout(t);
  }
}
