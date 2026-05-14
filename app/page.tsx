import Link from "next/link";
import { getVehiclesCached } from "@/lib/vehicle-cache";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { veiculos, origem } = await getVehiclesCached();
  const destaque = veiculos.slice(0, 6);
  const wa = `https://wa.me/${env.whatsappE164}?text=${encodeURIComponent(
    "Olá! Vim pelo site da Bragança Veículos e quero atendimento.",
  )}`;

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-dark text-white">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,#fff_0,transparent_45%),radial-gradient(circle_at_80%_0%,#38bdf8_0,transparent_40%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:flex-row md:items-center md:py-24">
          <div className="flex-1 space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Bragança Paulista</p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              O carro certo, com transparência e experiência premium.
            </h1>
            <p className="max-w-xl text-base text-blue-50 md:text-lg">
              Estoque selecionado, laudo e procedência conferidos, financiamento facilitado e pós-venda que acompanha você.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/catalogo"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand shadow-lg transition hover:bg-blue-50"
              >
                Explorar estoque
              </Link>
              <Link
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Falar no WhatsApp
              </Link>
            </div>
            {origem === "fallback" && (
              <p className="text-xs text-amber-200">
                Estamos exibindo o último estoque sincronizado; a conexão com a integração pode estar instável.
              </p>
            )}
          </div>
          <div className="flex-1 rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
            <p className="text-sm font-semibold text-blue-100">Destaques</p>
            <div className="mt-4 space-y-3 text-sm text-blue-50">
              <p>• Seminovos inspecionados e com histórico transparente</p>
              <p>• Financiamento com as principais financeiras</p>
              <p>• Avaliação do seu usado na loja</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Veículos em destaque</h2>
            <p className="mt-2 text-slate-600">Seleção atualizada diretamente do nosso estoque.</p>
          </div>
          <Link href="/catalogo" className="text-sm font-semibold text-brand hover:underline">
            Ver catálogo completo
          </Link>
        </div>
        {destaque.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
            Estamos preparando o estoque. Enquanto isso, fale conosco no WhatsApp.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destaque.map((v) => (
              <VehicleCard key={v.id} v={v} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-3">
          {[
            {
              t: "Curadoria de estoque",
              d: "Cada veículo passa por checagem para você comprar com segurança.",
            },
            {
              t: "Financiamento sob medida",
              d: "Simulação transparente e aprovação com agilidade.",
            },
            {
              t: "Pós-venda próximo",
              d: "Time local para tirar dúvidas e apoiar depois da compra.",
            },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{x.t}</h3>
              <p className="mt-2 text-sm text-slate-600">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="overflow-hidden rounded-3xl bg-brand text-white">
          <div className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
            <div>
              <h2 className="text-2xl font-bold">Financiamento facilitado</h2>
              <p className="mt-3 text-sm text-blue-100">
                Entrada flexível, prazos competitivos e simulação clara — sem letras miúdas na conversa.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3">
              <Link
                href="/contato"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand transition hover:bg-blue-50"
              >
                Quero simular
              </Link>
              <Link
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Tirar dúvidas no WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">O que dizem nossos clientes</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "Carlos M.",
                t: "Atendimento consultivo e carro impecável. Recomendo de olhos fechados.",
              },
              {
                n: "Renata S.",
                t: "Processo de financiamento sem surpresas. Equipe muito profissional.",
              },
              {
                n: "Pedro A.",
                t: "Troquei meu usado e saí de carro novo no mesmo dia. Experiência premium.",
              },
            ].map((d) => (
              <figure key={d.n} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <blockquote className="text-sm text-slate-700">“{d.t}”</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-slate-900">{d.n}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
          <h2 className="text-2xl font-bold text-slate-900">Pronto para dar o próximo passo?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Fale com um consultor, agende uma visita ou simule financiamento — estamos prontos para ajudar.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
            >
              Ver estoque
            </Link>
            <Link
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-brand hover:text-brand"
            >
              Chamar no WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
