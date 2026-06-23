import { NextRequest } from "next/server";
import { getEnv } from "@/cloudflare/bindings/env";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ filePath: string[] }> }
) {
  try {
    const { filePath } = await params;
    const key = filePath.join("/");

    if (!key) {
      return new Response("Invalid file path", { status: 400 });
    }

    let env: CloudflareEnv | null = null;
    try {
      env = getEnv();
    } catch (e) {
      // Local dev fallback
    }

    const contentType = request.headers.get("content-type") || "application/octet-stream";

    if (env && env.ANIME_BUCKET) {
      const body = request.body;
      if (!body) {
        return new Response("Request body is empty", { status: 400 });
      }

      await env.ANIME_BUCKET.put(key, body, {
        httpMetadata: { contentType },
      });

      return new Response("OK", { status: 200 });
    }

    // Fallback: proxy PUT to mock R2 server
    const mockR2Url = `http://127.0.0.1:3000/${key}`;
    const body = await request.arrayBuffer();
    const response = await fetch(mockR2Url, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body,
    });

    if (!response.ok) {
      return new Response("Upload to Mock R2 failed", { status: response.status });
    }

    return new Response("OK", { status: 200 });
  } catch (error: any) {
    console.error("Internal upload error:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
