import { SHORTS, STOPS } from "@/constants";

/** Attach challengeName for stops (booth) and bonuses (title) in cloud progress JSON. */
export function enrichProgressSnapshot(
  stops: Record<number, unknown>,
  shorts: Record<string, unknown>,
): { stops: Record<string, unknown>; shorts: Record<string, unknown> } {
  const enrichedStops: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(stops)) {
    const index = Number(key);
    const stop = STOPS[index];
    const { co: _legacyCo, ...rest } = (value ?? {}) as Record<string, unknown>;
    enrichedStops[key] = {
      ...rest,
      challengeName: stop?.co ?? `Stop ${index + 1}`,
    };
  }

  const enrichedShorts: Record<string, unknown> = {};
  for (const [slug, value] of Object.entries(shorts)) {
    const short = SHORTS.find((s) => s.slug === slug);
    enrichedShorts[slug] = {
      ...(value as object),
      challengeName: short?.title ?? slug,
    };
  }

  return { stops: enrichedStops, shorts: enrichedShorts };
}
