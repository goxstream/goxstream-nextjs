import { StorageProvider } from "./types";

export class R2StorageProvider implements StorageProvider {
  constructor(private bucket: R2Bucket) {}

  async uploadFile(
    key: string,
    body: ReadableStream | ArrayBuffer | string | Blob,
    contentType: string
  ): Promise<void> {
    await this.bucket.put(key, body, {
      httpMetadata: { contentType },
    });
  }

  async downloadFile(key: string): Promise<Response> {
    const object = await this.bucket.get(key);
    if (!object) {
      return new Response("Object not found", { status: 404 });
    }
    
    return new Response(object.body, {
      headers: {
        "content-type": object.httpMetadata?.contentType || "application/octet-stream",
        "etag": object.httpEtag,
      },
    });
  }

  async deleteFile(key: string): Promise<void> {
    await this.bucket.delete(key);
  }

  async generatePresignedUploadUrl(
    key: string,
    contentType: string,
    expiresInSeconds: number = 3600
  ): Promise<string> {
    // Cloudflare R2Bucket binding does not support generating presigned URLs natively inside the worker context.
    // We return an internal proxy endpoint URL that uses the R2 binding for direct upload:
    return `/api/media/storage/upload?key=${encodeURIComponent(key)}&contentType=${encodeURIComponent(contentType)}`;
  }

  async generatePresignedDownloadUrl(
    key: string,
    expiresInSeconds: number = 3600
  ): Promise<string> {
    // Return our internal proxy endpoint for downloading / streaming the object:
    return `/api/media/storage/download?key=${encodeURIComponent(key)}`;
  }
}
