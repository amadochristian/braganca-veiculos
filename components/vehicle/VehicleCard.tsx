import Image from "next/image";
import Link from "next/link";
import type { Vehicle } from "@/types/vehicle";

export function VehicleCard({ v }: { v: Vehicle }) {
  const cover = v.fotos[0] || "/placeholder-car.svg";
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md">
      <Link href={`/veiculos/${encodeURIComponent(v.slug)}`} className="relative aspect-[4/3] bg-slate-100">
        <Image
          src={cover}
          alt={`${v.marca} ${v.modelo}`}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
          sizes="(max-width:768px) 100vw, 33vw"
          unoptimized
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand shadow-sm">
          {v.ano || "—"}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{v.marca}</p>
          <h3 className="text-lg font-semibold text-slate-900">
            {v.modelo} {v.versao}
          </h3>
          <p className="text-sm text-slate-600">
            {v.quilometragem ? `${v.quilometragem.toLocaleString("pt-BR")} km` : "Km sob consulta"} ·{" "}
            {v.cambio || "Câmbio —"} · {v.combustivel || "Combustível —"}
          </p>
        </div>
        <p className="text-xl font-bold text-brand">{v.precoFormatado}</p>
        <div className="mt-auto flex gap-2 pt-2">
          <Link
            href={`/veiculos/${encodeURIComponent(v.slug)}`}
            className="flex-1 rounded-xl border border-slate-200 py-2 text-center text-sm font-semibold text-slate-800 transition hover:border-brand hover:text-brand"
          >
            Ver detalhes
          </Link>
          <Link
            href={v.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-xl bg-[#25D366] py-2 text-center text-sm font-semibold text-white transition hover:brightness-110"
          >
            WhatsApp
          </Link>
        </div>
      </div>
    </article>
  );
}
