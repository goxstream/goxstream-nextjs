import { getEnv } from "../../cloudflare/bindings/env";
import { R2StorageProvider } from "./r2";
import { S3CompatibleStorageProvider } from "./s3";
import { StorageProvider } from "./types";

export * from "./types";
export * from "./r2";
export * from "./s3";

export class StorageManager {
  private static providers: Record<string, StorageProvider> = {};

  /**
   * Retrieves the storage provider for a specific bucket target.
   * If an R2 binding matching `bindingName` is found in the environment context, it uses R2StorageProvider.
   * Otherwise, if S3 configuration is present, it uses S3CompatibleStorageProvider.
   * 
   * @param bindingName The name of the R2 binding (e.g. "ANIME_BUCKET")
   */
  static getProvider(bindingName: string): StorageProvider {
    if (this.providers[bindingName]) {
      return this.providers[bindingName];
    }

    let env: any;
    try {
      env = getEnv();
    } catch (error) {
      env = typeof process !== "undefined" ? process.env : {};
    }

    const r2Bucket = env?.[bindingName];
    if (r2Bucket && typeof r2Bucket.put === "function" && typeof r2Bucket.get === "function") {
      const provider = new R2StorageProvider(r2Bucket as R2Bucket);
      this.providers[bindingName] = provider;
      return provider;
    }

    const endpoint = env?.GOX_S3_ENDPOINT || process?.env?.GOX_S3_ENDPOINT;
    const accessKeyId = env?.GOX_S3_ACCESS_KEY_ID || process?.env?.GOX_S3_ACCESS_KEY_ID;
    const secretAccessKey = env?.GOX_S3_SECRET_ACCESS_KEY || process?.env?.GOX_S3_SECRET_ACCESS_KEY;
    const bucketName = env?.GOX_S3_BUCKET_NAME || process?.env?.GOX_S3_BUCKET_NAME || bindingName.toLowerCase();
    const region = env?.GOX_S3_REGION || process?.env?.GOX_S3_REGION;

    if (endpoint && accessKeyId && secretAccessKey) {
      const provider = new S3CompatibleStorageProvider({
        endpoint,
        accessKeyId,
        secretAccessKey,
        bucketName,
        region,
      });
      this.providers[bindingName] = provider;
      return provider;
    }

    throw new Error(
      `No storage provider resolved for '${bindingName}'. Please bind the Cloudflare R2 bucket in wrangler.jsonc or configure GOX_S3_* environment variables.`
    );
  }
}
