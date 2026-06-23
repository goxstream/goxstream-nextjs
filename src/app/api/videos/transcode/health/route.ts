import { getEnv } from "@/cloudflare/bindings/env";

export async function GET() {
  try {
    let devConverterUrl = process.env.GOX_CONVERTER_URL;
    let env: any = null;
    try {
      env = getEnv();
      if (env && env.GOX_CONVERTER_URL) {
        devConverterUrl = env.GOX_CONVERTER_URL;
      }
    } catch (e) {
      // Dev mode local next dev
    }

    if (devConverterUrl) {
      return await fetch(`${devConverterUrl}/health`);
    }

    if (!env || !env.CONVERTER_SERVICE) {
      throw new Error("CONVERTER_SERVICE service binding is not configured.");
    }

    return await env.CONVERTER_SERVICE.fetch("http://localhost/health");
  } catch (error: any) {
    console.error("Failed to check HLS Converter health:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

