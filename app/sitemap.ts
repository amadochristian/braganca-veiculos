import type { MetadataRoute } from "next";
import { getVehiclesCached } from "@/lib/vehicle-cache";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const { veiculos } = await getVehiclesCached();
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/catalogo`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/contato`, changeFrequency: "monthly", priority: 0.6 },
  ];
  const dynamic = veiculos.map((v) => ({
    url: `${base}/veiculos/${encodeURIComponent(v.slug)}`,
    changeFrequency: "daily" as const,
    priority: 0.75,
  }));
  return [...staticEntries, ...dynamic];
}
