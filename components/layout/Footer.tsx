import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-slate-900">Bragança Veículos</p>
          <p className="mt-2 text-sm text-slate-600">
            Experiência premium na compra do seu próximo carro, com transparência e pós-venda próximo de você.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Links rápidos</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/catalogo" className="hover:text-brand">
                Catálogo
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:text-brand">
                Contato
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Atendimento</p>
          <p className="mt-3 text-sm text-slate-600">Bragança Paulista — SP</p>
          <p className="mt-1 text-sm text-slate-600">Horário comercial para visitas agendadas.</p>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Bragança Veículos. Todos os direitos reservados.
      </div>
    </footer>
  );
}
