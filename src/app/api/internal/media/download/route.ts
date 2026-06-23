import { NextRequest } from "next/server";
import { getEnv } from "@/cloudflare/bindings/env";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return new Response("Key parameter is required", { status: 400 });
  }

  try {
    let env: CloudflareEnv | null = null;
    try {
      env = getEnv();
    } catch (e) {
      // Local dev fallback
    }

    if (env && env.ANIME_BUCKET) {
      const object = await env.ANIME_BUCKET.get(key);
      if (!object) {
        return new Response("Object Not Found", { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);

      return new Response(object.body, {
        headers,
      });
    }

    // Fallback: proxy to mock R2 server
    const mockR2Url = `http://127.0.0.1:3000/${key}`;
    const response = await fetch(mockR2Url);
    if (!response.ok) {
      return new Response("Object Not Found from Mock R2", { status: response.status });
    }

    return new Response(response.body, {
      headers: response.headers,
    });
  } catch (error: any) {
    console.error("Internal download error:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
