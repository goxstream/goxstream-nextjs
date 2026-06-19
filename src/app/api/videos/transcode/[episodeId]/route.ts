import { getContainerBinding } from "@/cloudflare/bindings/container";

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
    const binding = getContainerBinding("GOXSTREAM_CONTAINER");
    
    // Dynamically import @cloudflare/containers
    const { getContainer } = await import("@cloudflare/containers");
    
    // Ambil instance kontainer untuk episode bersangkutan
    const containerInstance = getContainer(binding as any, episodeId);
    
    // Meneruskan request WebSocket handshake secara langsung ke kontainer
    return containerInstance.fetch(request);
  } catch (error: any) {
    console.error("Failed to proxy WebSocket to GoxstreamContainer:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
