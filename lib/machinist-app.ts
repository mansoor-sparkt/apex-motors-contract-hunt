import { MACHINIST_APP_URL } from "@/constants";

/** Opens the Phillips Machinist app download / deep link in a new tab. */
export function openMachinistApp(): void {
  if (typeof window === "undefined") return;
  window.open(MACHINIST_APP_URL, "_blank", "noopener,noreferrer");
}
