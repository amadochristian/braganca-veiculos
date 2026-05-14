import type { Vehicle } from "@/types/vehicle";
import { ensureArray } from "@/lib/to-array";
import { env } from "@/lib/env";

/** Remove acentos e gera slug para URL */
export function slugifyPart(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildVehicleSlug(v: Pick<Vehicle, "marca" | "modelo" | "versao" | "ano" | "id">): string {
  const parts = [v.marca, v.modelo, v.versao, String(v.ano), v.id].map(slugifyPart).filter(Boolean);
  return parts.join("-") || `veiculo-${v.id}`;
}

function firstString(...vals: unknown[]): string {
  for (const v of vals) {
    if (v === null || v === undefined) continue;
    if (typeof v === "string") {
      const t = v.trim();
      if (t) return t;
    }
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
    if (typeof v === "object" && v !== null && "__cdata" in (v as object)) {
      const c = (v as { __cdata?: string }).__cdata;
      if (typeof c === "string" && c.trim()) return c.trim();
    }
    if (typeof v === "object" && v !== null && "#text" in (v as object)) {
      const t = (v as { "#text"?: string })["#text"];
      if (typeof t === "string" && t.trim()) return t.trim();
    }
  }
  return "";
}

function pickString(obj: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    if (k in obj) {
      const s = firstString(obj[k]);
      if (s) return s;
    }
  }
  return "";
}

function parseMoney(raw: string): number {
  if (!raw) return 0;
  const n = raw.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const v = Number.parseFloat(n);
  return Number.isFinite(v) ? v : 0;
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number {
  for (const k of keys) {
    if (!(k in obj)) continue;
    const val = obj[k];
    if (typeof val === "number" && Number.isFinite(val)) return val;
    const s = firstString(val);
    if (s) {
      const only = s.replace(/[^\d.-]/g, "");
      const v = Number.parseFloat(only);
      if (Number.isFinite(v)) return v;
      const money = parseMoney(s);
      if (money) return Math.round(money);
    }
  }
  return 0;
}

function extractPhotoUrls(node: unknown): string[] {
  const out: string[] = [];
  const walk = (x: unknown) => {
    if (!x) return;
    if (typeof x === "string") {
      const u = x.trim();
      if (/^https?:\/\//i.test(u)) out.push(u);
      return;
    }
    if (typeof x !== "object") return;
    const o = x as Record<string, unknown>;
    const urlKeys = ["URL", "Url", "url", "Link", "link", "Foto", "foto", "Imagem", "imagem", "Src", "src"];
    for (const k of urlKeys) {
      if (k in o) {
        const s = firstString(o[k]);
        if (/^https?:\/\//i.test(s)) out.push(s);
      }
    }
    for (const v of Object.values(o)) {
      if (Array.isArray(v)) v.forEach(walk);
      else if (typeof v === "object") walk(v);
    }
  };
  walk(node);
  return [...new Set(out)];
}

function extractOpcionais(node: unknown): string[] {
  if (!node) return [];
  const items: string[] = [];
  const arr: unknown[] = ensureArray(node);
  for (const el of arr) {
    if (typeof el === "string") {
      const t = el.trim();
      if (t) items.push(t);
    } else if (typeof el === "object" && el !== null) {
      const o = el as Record<string, unknown>;
      const text = pickString(o, [
        "Descricao",
        "descricao",
        "Nome",
        "nome",
        "Opcional",
        "opcional",
        "Item",
        "item",
        "Texto",
        "texto",
      ]);
      if (text) items.push(text);
    }
  }
  return items.filter(Boolean);
}

function findVehicleRecords(parsed: unknown): Record<string, unknown>[] {
  if (!parsed) return [];
  if (Array.isArray(parsed)) {
    if (parsed.length && typeof parsed[0] === "object" && parsed[0] !== null) {
      const first = parsed[0] as Record<string, unknown>;
      if (pickString(first, ["Marca", "marca"])) return parsed as Record<string, unknown>[];
    }
    return [];
  }
  if (typeof parsed !== "object") return [];
  const visit = (o: Record<string, unknown>): Record<string, unknown>[] => {
    const listKeys = ["Anuncio", "anuncio", "Veiculo", "veiculo", "Item", "item"];
    for (const lk of listKeys) {
      if (lk in o) return ensureArray(o[lk]) as Record<string, unknown>[];
    }
    for (const v of Object.values(o)) {
      if (v && typeof v === "object" && !Array.isArray(v)) {
        const inner = v as Record<string, unknown>;
        const hit = visit(inner);
        if (hit.length) return hit;
      }
      if (Array.isArray(v) && v.length && typeof v[0] === "object") {
        const first = v[0] as Record<string, unknown>;
        if (pickString(first, ["Marca", "marca"]) && pickString(first, ["Modelo", "modelo"])) {
          return v as Record<string, unknown>[];
        }
      }
    }
    return [];
  };
  return visit(parsed as Record<string, unknown>);
}

function pickId(raw: Record<string, unknown>): string {
  const id =
    pickString(raw, [
      "Codigo",
      "codigo",
      "CodigoVeiculo",
      "codigo_veiculo",
      "Id",
      "id",
      "ID",
      "Placa",
      "placa",
    ]) || `hash-${stableSmallHash(JSON.stringify(raw)).slice(0, 12)}`;
  return id.replace(/\s+/g, "-");
}

function stableSmallHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function buildWhatsappLink(vehicle: Pick<Vehicle, "marca" | "modelo" | "versao" | "ano" | "precoFormatado">): string {
  const phone = env.whatsappE164;
  const msg = [
    "Olá! Tenho interesse no veículo:",
    `${vehicle.marca} ${vehicle.modelo} ${vehicle.versao}`.trim(),
    vehicle.ano ? `${vehicle.ano}` : "",
    vehicle.precoFormatado ? `— ${vehicle.precoFormatado}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const qs = new URLSearchParams({ text: msg });
  return `https://wa.me/${phone}?${qs.toString()}`;
}

export function mapRawToVehicle(raw: Record<string, unknown>): Vehicle {
  const marca = pickString(raw, ["Marca", "marca", "MARCA"]);
  const modelo = pickString(raw, ["Modelo", "modelo", "MODELO"]);
  const versao = pickString(raw, ["Versao", "versao", "VERSAO", "Version", "version"]);
  const ano =
    pickNumber(raw, ["AnoModelo", "ano_modelo", "Ano", "ano", "ANO"]) ||
    pickNumber(raw, ["AnoFabricacao", "ano_fabricacao"]);
  const anoModelo = pickNumber(raw, ["AnoModelo", "ano_modelo"]) || undefined;
  const preco =
    pickNumber(raw, ["Preco", "preco", "PRECO", "Valor", "valor", "VALOR"]) ||
    parseMoney(pickString(raw, ["Preco", "preco", "Valor", "valor"]));
  const km = pickNumber(raw, ["Quilometragem", "quilometragem", "KM", "km", "Kilometragem"]);
  const cambio = pickString(raw, ["Cambio", "cambio", "CAMBIO", "Transmissao", "transmissao"]);
  const combustivel = pickString(raw, ["Combustivel", "combustivel", "COMBUSTIVEL", "Combustível", "combustível"]);
  const cor = pickString(raw, ["Cor", "cor", "COR"]);
  const portas = pickNumber(raw, ["Portas", "portas", "PORTAS"]) || 0;
  const descricao = pickString(raw, ["Descricao", "descricao", "DESCRICAO", "DescricaoWeb", "descricao_web"]);
  const observacoes = pickString(raw, ["Observacao", "observacao", "OBSERVACAO", "Observações", "observacoes"]);

  let opcionais: string[] = [];
  const opNode =
    (raw.Opcionais as Record<string, unknown> | undefined)?.Opcional ??
    raw.Opcional ??
    raw.opcionais;
  if (opNode) opcionais = extractOpcionais(opNode);

  let fotos: string[] = [];
  const fotosNode = (raw.Fotos as Record<string, unknown> | undefined)?.Foto ?? raw.Fotos ?? raw.fotos;
  if (fotosNode) fotos = extractPhotoUrls(fotosNode);

  const id = pickId(raw);
  const precoFormatado = formatBRL(preco);

  const base: Omit<Vehicle, "slug" | "whatsappLink"> = {
    id,
    marca,
    modelo,
    versao,
    ano: ano || 0,
    anoModelo,
    preco,
    precoFormatado,
    quilometragem: km,
    cambio,
    combustivel,
    cor,
    portas,
    descricao,
    observacoes,
    opcionais,
    fotos,
  };
  const slug = buildVehicleSlug({ ...base, id });
  const whatsappLink = buildWhatsappLink({ ...base, marca, modelo, versao, ano: base.ano, precoFormatado });
  return { ...base, slug, whatsappLink };
}

export function vehiclesFromParsedXml(parsed: unknown): Vehicle[] {
  const rows = findVehicleRecords(parsed);
  return rows.map(mapRawToVehicle);
}
