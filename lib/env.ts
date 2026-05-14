function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

function getWhatsappDigits(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_E164 || "";
  const digits = raw.replace(/\D/g, "");
  /* Placeholder para build local; substitua em produção. */
  return digits || "5511999999999";
}

export const env = {
  get autocertoXmlUrl(): string {
    const url = process.env.AUTOCERTO_XML_URL?.trim();
    if (!url) throw new Error("AUTOCERTO_XML_URL não configurada");
    return url;
  },
  get whatsappE164(): string {
    return getWhatsappDigits();
  },
  get siteUrl(): string {
    return getSiteUrl();
  },
};
