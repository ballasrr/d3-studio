import type { NextConfig } from "next";

/**
 * Two build modes:
 *  - normal (`npm run build`): Next server / Vercel, root path.
 *  - static export for nginx (`STATIC_EXPORT=1 npm run build`): files under
 *    `/d3/`, so the site can live next to other projects on the same server
 *    (e.g. https://shah-hookah-bar.ru/d3/). No Node process required.
 */
const isExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isExport
    ? {
        output: "export" as const,
        basePath: "/d3",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        cacheComponents: true,
        partialPrefetching: true,
      }),
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
