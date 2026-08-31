import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Sin cache incremental por ahora. Las 25 paginas se prerenderizan en el build
 * y se sirven como assets estaticos desde la red de Cloudflare; no hay ISR ni
 * revalidacion que justifique todavia el bucket R2.
 *
 * Cuando el contenido pase a MDX con revalidacion, aqui se enchufa
 * `r2IncrementalCache` sin tocar el resto del proyecto.
 */
export default defineCloudflareConfig();
