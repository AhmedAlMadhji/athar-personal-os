import { Tajawal } from "next/font/google";

export const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

/** Single app-wide font stack (CSS variable + fallback). */
export const APP_FONT_FAMILY =
  'var(--font-tajawal), "Tajawal", sans-serif';
