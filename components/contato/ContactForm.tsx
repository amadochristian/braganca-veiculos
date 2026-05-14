"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sent");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Nome
          <input required name="nome" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          E-mail
          <input required type="email" name="email" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Telefone / WhatsApp
          <input required name="fone" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Assunto
          <input name="assunto" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2" />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Mensagem
        <textarea required name="msg" rows={4} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2" />
      </label>
      <button
        type="submit"
        className="w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white transition hover:bg-brand-dark md:w-auto md:px-8"
      >
        Enviar mensagem
      </button>
      {status === "sent" && (
        <p className="text-sm text-emerald-700">
          Obrigado! Em produção, conecte este formulário a um endpoint ou serviço de e-mail.
        </p>
      )}
    </form>
  );
}
