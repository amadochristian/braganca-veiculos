/**
 * Garante array: um único item vira `[item]`, null/undefined vira `[]`.
 */
export function ensureArray<T>(value: T | T[] | null | undefined): T[] {
  if (value === null || value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}
