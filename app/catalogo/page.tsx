import { CatalogoInteractive } from "@/components/catalog/CatalogoInteractive";
import { getVehiclesCached } from "@/lib/vehicle-cache";

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const { veiculos } = await getVehiclesCached();
  return <CatalogoInteractive initial={veiculos} />;
}
