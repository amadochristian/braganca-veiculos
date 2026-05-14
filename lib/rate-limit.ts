const WINDOW_MS = 60_000;
const MAX = 120;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function getKey(headers: Headers): string {
  const xf = headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip") || headers.get("cf-connecting-ip") || "unknown";
}

/** Rate limit simples em memória (adequado a um único processo / dev). */
export function rateLimitOrThrow(headers: Headers): void {
  const key = getKey(headers);
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || now > b.resetAt) {
    b = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(key, b);
  }
  b.count += 1;
  if (b.count > MAX) {
    const err = new Error("RATE_LIMIT");
    (err as Error & { status: number }).status = 429;
    throw err;
  }
}
