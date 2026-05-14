import Link from "next/link";
import { env } from "@/lib/env";

export function WhatsAppFloat() {
  const href = `https://wa.me/${env.whatsappE164}?text=${encodeURIComponent(
    "Olá! Gostaria de falar com a Bragança Veículos.",
  )}`;
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg transition hover:scale-105 md:bottom-8"
      aria-label="WhatsApp"
    >
      <span aria-hidden>💬</span>
    </Link>
  );
}
