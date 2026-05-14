"use client";

import { useMemo, useState } from "react";
import type { Vehicle } from "@/types/vehicle";
import { VehicleCard } from "@/components/vehicle/VehicleCard";

type SortKey = "preco_asc" | "preco_desc" | "ano_desc" | "km_asc";

const PAGE_SIZE = 9;

function normalize(s: string) {
  return s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

export function CatalogoInteractive({ initial }: { initial: Vehicle[] }) {
  const [q, setQ] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [combustivel, setCombustivel] = useState("");
  const [cambio, setCambio] = useState("");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  const [anoMin, setAnoMin] = useState("");
  const [anoMax, setAnoMax] = useState("");
  const [sort, setSort] = useState<SortKey>("preco_asc");
  const [page, setPage] = useState(1);

  const marcas = useMemo(() => {
    const s = new Set<string>();
    initial.forEach((v) => v.marca && s.add(v.marca));
    return [...s].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [initial]);

  const modelos = useMemo(() => {
    const base = marca ? initial.filter((v) => v.marca === marca) : initial;
    const s = new Set<string>();
    base.forEach((v) => v.modelo && s.add(v.modelo));
    return [...s].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [initial, marca]);

  const filtered = useMemo(() => {
    const nq = normalize(q.trim());
    const pMin = precoMin ? Number(precoMin) : null;
    const pMax = precoMax ? Number(precoMax) : null;
    const aMin = anoMin ? Number(anoMin) : null;
    const aMax = anoMax ? Number(anoMax) : null;

    let list = initial.filter((v) => {
      if (marca && v.marca !== marca) return false;
      if (modelo && v.modelo !== modelo) return false;
      if (combustivel && v.combustivel !== combustivel) return false;
      if (cambio && v.cambio !== cambio) return false;
      if (pMin !== null && !Number.isNaN(pMin) && v.preco < pMin) return false;
      if (pMax !== null && !Number.isNaN(pMax) && v.preco > pMax) return false;
      if (aMin !== null && !Number.isNaN(aMin) && v.ano < aMin) return false;
      if (aMax !== null && !Number.isNaN(aMax) && v.ano > aMax) return false;
      if (!nq) return true;
      const blob = normalize(
        [v.marca, v.modelo, v.versao, v.combustivel, v.cambio, v.cor, v.descricao].filter(Boolean).join(" "),
      );
      return blob.includes(nq);
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "preco_asc":
          return a.preco - b.preco;
        case "preco_desc":
          return b.preco - a.preco;
        case "ano_desc":
          return b.ano - a.ano;
        case "km_asc":
          return a.quilometragem - b.quilometragem;
        default:
          return 0;
      }
    });
    return list;
  }, [initial, q, marca, modelo, combustivel, cambio, precoMin, precoMax, anoMin, anoMax, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const slice = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const combustiveis = useMemo(() => {
    const s = new Set<string>();
    initial.forEach((v) => v.combustivel && s.add(v.combustivel));
    return [...s].sort();
  }, [initial]);

  const cambios = useMemo(() => {
    const s = new Set<string>();
    initial.forEach((v) => v.cambio && s.add(v.cambio));
    return [...s].sort();
  }, [initial]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Catálogo</h1>
        <p className="text-slate-600">Busca instantânea, filtros e ordenação — tudo no seu ritmo.</p>
      </div>

      <div className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          Busca
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Marca, modelo, versão..."
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Marca
          <select
            value={marca}
            onChange={(e) => {
              setMarca(e.target.value);
              setModelo("");
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          >
            <option value="">Todas</option>
            {marcas.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Modelo
          <select
            value={modelo}
            onChange={(e) => {
              setModelo(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          >
            <option value="">Todos</option>
            {modelos.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Ordenação
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortKey);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          >
            <option value="preco_asc">Menor preço</option>
            <option value="preco_desc">Maior preço</option>
            <option value="ano_desc">Mais novo</option>
            <option value="km_asc">Menor km</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Combustível
          <select
            value={combustivel}
            onChange={(e) => {
              setCombustivel(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          >
            <option value="">Todos</option>
            {combustiveis.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Câmbio
          <select
            value={cambio}
            onChange={(e) => {
              setCambio(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          >
            <option value="">Todos</option>
            {cambios.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Preço mínimo (R$)
          <input
            inputMode="numeric"
            value={precoMin}
            onChange={(e) => {
              setPrecoMin(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Preço máximo (R$)
          <input
            inputMode="numeric"
            value={precoMax}
            onChange={(e) => {
              setPrecoMax(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Ano mínimo
          <input
            inputMode="numeric"
            value={anoMin}
            onChange={(e) => {
              setAnoMin(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Ano máximo
          <input
            inputMode="numeric"
            value={anoMax}
            onChange={(e) => {
              setAnoMax(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          />
        </label>
      </div>

      <p className="mb-4 text-sm text-slate-600">
        Exibindo <span className="font-semibold text-slate-900">{filtered.length}</span> veículo(s)
      </p>

      {slice.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-600">
          Nenhum veículo encontrado com os filtros atuais.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {slice.map((v) => (
            <VehicleCard key={v.id} v={v} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`min-w-[2.5rem] rounded-lg px-3 py-2 text-sm font-semibold ${
                p === currentPage ? "bg-brand text-white" : "border border-slate-200 bg-white text-slate-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
