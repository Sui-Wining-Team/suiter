import { walrusClient, WALRUS_CONFIG, getWalrusBlobUrl } from "./walrusConfig";
import { Transaction } from "@mysten/sui/transactions";

export interface UploadResult {
  blobId: string;
  suiRef?: string;
  cost?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Upload a file to Walrus storage
 * @param file - File to upload
 * @param onProgress - Optional progress callback
 * @returns Upload result with blob ID
 */
export async function uploadToWalrus(
  file: File,
  onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult> {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Walrus using fetch API directly
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${WALRUS_CONFIG.PUBLISHER_URL}/v1/store`, {
      method: "PUT",
      body: uint8Array,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();

    // Emit progress update
    if (onProgress) {
      onProgress({
        loaded: file.size,
        total: file.size,
        percentage: 100,
      });
    }

    return {
      blobId:
        result.newlyCreated?.blobObject?.blobId ||
        result.alreadyCertified?.blobId ||
        "",
      suiRef:
        result.newlyCreated?.blobObject?.id || result.alreadyCertified?.blobId,
      cost: result.cost?.toString(),
    };
  } catch (error) {
    console.error("Error uploading to Walrus:", error);
    throw new Error(
      `Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Upload multiple files to Walrus
 * @param files - Array of files to upload
 * @param onProgress - Optional progress callback for each file
 * @returns Array of blob IDs
 */
export async function uploadMultipleToWalrus(
  files: File[],
  onProgress?: (fileIndex: number, progress: UploadProgress) => void,
): Promise<string[]> {
  const blobIds: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const result = await uploadToWalrus(file, (progress) => {
      if (onProgress) {
        onProgress(i, progress);
      }
    });
    blobIds.push(result.blobId);
  }

  return blobIds;
}

/**
 * Fetch data from Walrus by blob ID
 * @param blobId - Blob ID to fetch
 * @returns Blob data
 */
export async function fetchFromWalrus(blobId: string): Promise<Blob> {
  try {
    const url = getWalrusBlobUrl(blobId);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("Error fetching from Walrus:", error);
    throw new Error(
      `Failed to fetch blob: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Validate file before upload
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default: 10MB)
 * @returns Validation result
 */
export function validateFile(
  file: File,
  maxSizeMB: number = 10,
): { valid: boolean; error?: string } {
  const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  // Check file type
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/webm",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "File type not supported. Only images and videos are allowed.",
    };
  }

  return { valid: true };
}
