import Link from "next/link";

export function StickyCtaMobile() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        <Link
          href="/catalogo"
          className="flex-1 rounded-xl border border-brand bg-white py-3 text-center text-sm font-semibold text-brand"
        >
          Ver estoque
        </Link>
        <Link
          href="/contato"
          className="flex-1 rounded-xl bg-brand py-3 text-center text-sm font-semibold text-white shadow-sm"
        >
          Financiar
        </Link>
      </div>
    </div>
  );
}
