import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VehicleGallery } from "@/components/vehicle/VehicleGallery";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { env } from "@/lib/env";
import { getVehiclesCached } from "@/lib/vehicle-cache";
import type { Vehicle } from "@/types/vehicle";

export const dynamic = "force-dynamic";

function findVehicle(veiculos: Vehicle[], slug: string) {
  const decoded = decodeURIComponent(slug);
  return veiculos.find((v) => v.slug === decoded || v.id === decoded) ?? null;
}

function jsonLd(v: Vehicle, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${v.marca} ${v.modelo} ${v.versao}`.trim(),
    brand: { "@type": "Brand", name: v.marca },
    model: v.modelo,
    vehicleModelDate: v.ano,
    color: v.cor,
    fuelType: v.combustivel,
    vehicleTransmission: v.cambio,
    numberOfDoors: v.portas || undefined,
    mileageFromOdometer: v.quilometragem
      ? { "@type": "QuantitativeValue", value: v.quilometragem, unitCode: "KMT" }
      : undefined,
    offers: {
      "@type": "Offer",
      price: v.preco,
      priceCurrency: "BRL",
      url,
      availability: "https://schema.org/InStock",
    },
    image: v.fotos,
  };
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const { veiculos } = await getVehiclesCached();
  const v = findVehicle(veiculos, slug);
  if (!v) return { title: "Veículo não encontrado" };
  const title = `${v.marca} ${v.modelo} ${v.versao} ${v.ano}`.trim();
  const description = [v.precoFormatado, v.quilometragem ? `${v.quilometragem.toLocaleString("pt-BR")} km` : ""]
    .filter(Boolean)
    .join(" · ");
  const url = `${env.siteUrl}/veiculos/${encodeURIComponent(v.slug)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: v.fotos[0] ? [{ url: v.fotos[0] }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: v.fotos[0] ? [v.fotos[0]] : undefined,
    },
  };
}

export default async function VeiculoPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const { veiculos } = await getVehiclesCached();
  const v = findVehicle(veiculos, slug);
  if (!v) notFound();

  const url = `${env.siteUrl}/veiculos/${encodeURIComponent(v.slug)}`;
  const relacionados = veiculos
    .filter((x) => x.id !== v.id)
    .sort((a, b) => {
      const sa = a.marca === v.marca ? 0 : 1;
      const sb = b.marca === v.marca ? 0 : 1;
      return sa - sb;
    })
    .slice(0, 3);

  const shareUrl = encodeURIComponent(url);
  const shareText = encodeURIComponent(`${v.marca} ${v.modelo} ${v.versao}`);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(v, url)) }} />

      <div className="mb-6 text-sm text-slate-600">
        <Link href="/catalogo" className="hover:text-brand">
          Catálogo
        </Link>{" "}
        /{" "}
        <span className="text-slate-900">
          {v.marca} {v.modelo}
        </span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <VehicleGallery fotos={v.fotos} alt={`${v.marca} ${v.modelo}`} />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">{v.marca}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
            {v.modelo} {v.versao}
          </h1>
          <p className="mt-2 text-slate-600">
            {v.ano} · {v.quilometragem ? `${v.quilometragem.toLocaleString("pt-BR")} km` : "Km sob consulta"} ·{" "}
            {v.cor || "Cor sob consulta"}
          </p>
          <p className="mt-6 text-3xl font-bold text-brand">{v.precoFormatado}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={v.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#25D366] px-4 py-3 text-center text-sm font-semibold text-white transition hover:brightness-110"
            >
              Falar no WhatsApp
            </Link>
            <Link
              href="/contato"
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-brand px-4 py-3 text-center text-sm font-semibold text-brand transition hover:bg-brand/5"
            >
              Simular financiamento
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            <a
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 hover:border-brand hover:text-brand"
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
            <a
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 hover:border-brand hover:text-brand"
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
              target="_blank"
              rel="noreferrer"
            >
              X
            </a>
            <a
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 hover:border-brand hover:text-brand"
              href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Descrição</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
            {v.descricao || "Descrição em breve."}
          </p>
          {v.observacoes && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Observações</p>
              <p className="mt-2 whitespace-pre-line">{v.observacoes}</p>
            </div>
          )}
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Opcionais</h2>
          {v.opcionais.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600">Lista de opcionais em atualização.</p>
          ) : (
            <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
              {v.opcionais.map((o) => (
                <li key={o} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          )}
          <dl className="mt-8 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-slate-200 p-3">
              <dt className="text-slate-500">Combustível</dt>
              <dd className="font-semibold text-slate-900">{v.combustivel || "—"}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <dt className="text-slate-500">Câmbio</dt>
              <dd className="font-semibold text-slate-900">{v.cambio || "—"}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <dt className="text-slate-500">Portas</dt>
              <dd className="font-semibold text-slate-900">{v.portas || "—"}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <dt className="text-slate-500">Ano modelo</dt>
              <dd className="font-semibold text-slate-900">{v.anoModelo || v.ano || "—"}</dd>
            </div>
          </dl>
        </section>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-slate-900">Relacionados</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((x) => (
              <VehicleCard key={x.id} v={x} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
