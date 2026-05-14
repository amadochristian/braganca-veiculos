import Link from "next/link";

const nav = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 transition hover:opacity-90">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
            BV
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">Bragança Veículos</p>
            <p className="text-xs text-slate-500">Seminovos selecionados</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/catalogo"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
          >
            Ver estoque
          </Link>
        </nav>
        <details className="relative md:hidden">
          <summary className="list-none cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
