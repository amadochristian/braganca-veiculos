import Link from "next/link";
import { ContactForm } from "@/components/contato/ContactForm";
import { env } from "@/lib/env";

const mapsSrc = process.env.NEXT_PUBLIC_MAPS_EMBED_URL;

export default function ContatoPage() {
  const wa = `https://wa.me/${env.whatsappE164}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Contato</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Fale com nosso time para agendar visita, simular financiamento ou tirar dúvidas sobre o veículo desejado.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <ContactForm />
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Bragança Veículos</h2>
            <p className="mt-2 text-sm text-slate-600">Bragança Paulista — SP</p>
            <p className="mt-4 text-sm text-slate-700">
              Telefone / WhatsApp:{" "}
              <Link href={wa} className="font-semibold text-brand hover:underline" target="_blank">
                conversar agora
              </Link>
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Substitua o embed do mapa configurando <code className="rounded bg-white px-1">NEXT_PUBLIC_MAPS_EMBED_URL</code>{" "}
              no painel da Vercel.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {mapsSrc ? (
              <iframe title="Mapa" src={mapsSrc} className="h-72 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <div className="flex h-72 items-center justify-center p-6 text-center text-sm text-slate-600">
                Mapa não configurado. Cole a URL de incorporação do Google Maps em{" "}
                <span className="font-semibold"> NEXT_PUBLIC_MAPS_EMBED_URL</span>.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
