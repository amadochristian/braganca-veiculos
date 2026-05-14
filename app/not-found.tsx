import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">404</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Página não encontrada</h1>
      <p className="mt-3 text-slate-600">O endereço pode ter mudado ou o veículo já foi vendido.</p>
      <Link
        href="/catalogo"
        className="mt-8 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
      >
        Ir para o catálogo
      </Link>
    </div>
  );
}
