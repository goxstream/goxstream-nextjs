import { getEnv } from "@/cloudflare/bindings/env";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ episodeId: string }> }
) {
  // Pastikan request meminta upgrade koneksi WebSocket
  if (request.headers.get("Upgrade") !== "websocket") {
    return new Response("Expected WebSocket Connection", { status: 426 });
  }

  try {
    const { episodeId } = await params;
    
    let devConverterUrl = process.env.GOX_CONVERTER_URL;
    let env: any = null;
    try {
      env = getEnv();
      if (env && env.GOX_CONVERTER_URL) {
        devConverterUrl = env.GOX_CONVERTER_URL;
      }
    } catch (e) {
      // Bekerja di dev mode lokal (next dev) tanpa context wrangler
    }

    if (devConverterUrl) {
      // Hubungkan langsung ke WebSocket native runner di lokal
      const wsUrl = devConverterUrl.replace(/^http/, "ws") + `/ws?job_id=${episodeId}`;
      return fetch(wsUrl, { headers: request.headers });
    }

    if (!env || !env.CONVERTER_SERVICE) {
      throw new Error("CONVERTER_SERVICE service binding is not configured.");
    }

    // Meneruskan request WebSocket handshake secara langsung ke Service Binding
    return env.CONVERTER_SERVICE.fetch(`http://localhost/container/${episodeId}/ws?job_id=${episodeId}`, {
      headers: request.headers
    });
  } catch (error: any) {
    console.error("Failed to proxy WebSocket to HLS Converter:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

