import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/unbounded/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "./globals.css";

import SmoothScroll from "@/components/providers/SmoothScroll";
import MotionProvider from "@/components/providers/MotionProvider";
import CursorGlow from "@/components/chrome/CursorGlow";
import GrainOverlay from "@/components/chrome/GrainOverlay";
import ScrollProgress from "@/components/chrome/ScrollProgress";

const description =
  "D3 — студия разработки сайтов и цифровых продуктов. Дизайн, 3D-графика и продакшн-код: от идеи до запуска за 6–10 недель.";

/** Static export lives under /d3 on a shared nginx, so public URLs must match. */
const isExport = process.env.STATIC_EXPORT === "1";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://d3.studio";
const basePath = isExport ? "/d3" : "";

export const metadata: Metadata = {
  // metadataBase already contains /d3 in the export build, so every relative
  // asset path below resolves to https://<host>/d3/<file> in production.
  metadataBase: new URL(`${siteUrl}${basePath}`),
  title: {
    default: "D3 — студия разработки сайтов и цифровых продуктов",
    template: "%s — D3",
  },
  description,
  applicationName: "D3 Studio",
  keywords: [
    "разработка сайтов",
    "веб-студия",
    "digital-студия",
    "веб-приложение",
    "3D-сайт",
    "Next.js",
    "заказать сайт",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "D3 Studio",
    title: "D3 — третье измерение вашего бизнеса",
    description,
    url: "/",
    images: [
      { url: "/og.jpg", width: 1200, height: 630, alt: "D3 — студия разработки" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "D3 — третье измерение вашего бизнеса",
    description,
    images: ["/og.jpg"],
  },
  icons: { icon: `${basePath}/icon.svg` },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0d",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-accent-ink"
        >
          Перейти к содержимому
        </a>
        <SmoothScroll>
          <MotionProvider>
            <ScrollProgress />
            <CursorGlow />
            <GrainOverlay />
            {children}
          </MotionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
