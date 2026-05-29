import { MACHINIST_APP_URL } from "@/constants";

/** Opens the Phillips Machinist app download / deep link in a new tab. */
export function openMachinistApp(link?: string): void {
  if (typeof window === "undefined") return;
  const url = link?.trim() || MACHINIST_APP_URL;
  window.open(url, "_blank", "noopener,noreferrer");
}
