import { getContainerBinding } from "@/cloudflare/bindings/container";

export async function GET() {
  try {
    const binding = getContainerBinding("GOXSTREAM_CONTAINER");
    
    // Dynamically import @cloudflare/containers
    const { getContainer } = await import("@cloudflare/containers");
    
    // Gunakan dummy/test ID untuk memicu/menguji instansiasi kontainer
    const containerInstance = getContainer(binding as any, "health-check-test");
    
    const healthRequest = new Request("http://localhost/health", {
      method: "GET"
    });
    
    return await containerInstance.fetch(healthRequest);
  } catch (error: any) {
    console.error("Failed to check GoxstreamContainer health:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
