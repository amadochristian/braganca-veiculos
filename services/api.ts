import axios from "axios";
import type { VehicleDetailResponse, VehiclesListResponse } from "@/types/vehicle";

const client = axios.create({
  baseURL:
    typeof window !== "undefined"
      ? ""
      : (process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000").replace(/\/$/, ""),
  timeout: 20_000,
});

/** Cliente HTTP para o frontend consumir apenas a API interna (nunca o XML). */
export async function fetchVehiclesFromApi(): Promise<VehiclesListResponse> {
  const { data } = await client.get<VehiclesListResponse>("/api/veiculos");
  return data;
}

export async function fetchVehicleByIdFromApi(id: string): Promise<VehicleDetailResponse> {
  const { data } = await client.get<VehicleDetailResponse>(`/api/veiculos/${encodeURIComponent(id)}`);
  return data;
}
