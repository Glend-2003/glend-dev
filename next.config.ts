import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Necesario para la imagen Docker: empaqueta solo lo que el servidor usa.
  // El adaptador de Cloudflare no lo requiere, pero tampoco estorba, y
  // conservarlo es lo que mantiene el despliegue en Docker como alternativa real.
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

/**
 * Expone los bindings de Cloudflare durante `next dev`, para que el entorno de
 * desarrollo se parezca al de produccion. No afecta al build.
 */
initOpenNextCloudflareForDev();

export default nextConfig;
