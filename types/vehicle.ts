/** Veículo normalizado para o frontend e cache da API */
export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  versao: string;
  ano: number;
  anoModelo?: number;
  preco: number;
  precoFormatado: string;
  quilometragem: number;
  cambio: string;
  combustivel: string;
  cor: string;
  portas: number;
  descricao: string;
  observacoes: string;
  opcionais: string[];
  fotos: string[];
  slug: string;
  whatsappLink: string;
}

export interface VehiclesListResponse {
  veiculos: Vehicle[];
  atualizadoEm: string;
  origem: "live" | "cache" | "fallback";
}

export interface VehicleDetailResponse {
  veiculo: Vehicle | null;
  atualizadoEm: string;
  origem: "live" | "cache" | "fallback";
}
