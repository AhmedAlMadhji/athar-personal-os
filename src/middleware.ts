import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { detectLocaleFromHeader } from "@/lib/detectLocale";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: true,
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const locale = detectLocaleFromHeader(
      request.headers.get("accept-language")
    );
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/landing`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
