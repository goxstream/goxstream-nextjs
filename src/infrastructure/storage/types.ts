export interface StorageProvider {
  /**
   * Upload a file to the storage provider
   */
  uploadFile(
    key: string,
    body: ReadableStream | ArrayBuffer | string | Blob,
    contentType: string
  ): Promise<void>;

  /**
   * Retrieve a file from the storage provider as a Response object
   */
  downloadFile(key: string): Promise<Response>;

  /**
   * Delete a file from the storage provider
   */
  deleteFile(key: string): Promise<void>;

  /**
   * Generate a presigned URL to allow file uploads directly to the storage provider
   */
  generatePresignedUploadUrl(
    key: string,
    contentType: string,
    expiresInSeconds?: number
  ): Promise<string>;

  /**
   * Generate a presigned URL to allow direct file downloads from the storage provider
   */
  generatePresignedDownloadUrl(
    key: string,
    expiresInSeconds?: number
  ): Promise<string>;
}
