import { WalrusClient } from "@mysten/walrus";

// Walrus configuration for testnet
export const WALRUS_CONFIG = {
  // Walrus aggregator URL for testnet
  AGGREGATOR_URL: "https://aggregator.walrus-testnet.walrus.space",
  // Walrus publisher URL for testnet
  PUBLISHER_URL: "https://publisher.walrus-testnet.walrus.space",
  // Number of epochs to store (1 epoch ≈ 1 day)
  EPOCHS: 5,
};

// Initialize Walrus client
export const walrusClient = new WalrusClient({
  aggregatorUrl: WALRUS_CONFIG.AGGREGATOR_URL,
  publisherUrl: WALRUS_CONFIG.PUBLISHER_URL,
});

// Helper to get blob URL from blob ID
export function getWalrusBlobUrl(blobId: string): string {
  return `${WALRUS_CONFIG.AGGREGATOR_URL}/v1/${blobId}`;
}

// Check if a blob ID is valid
export function isValidBlobId(blobId: string): boolean {
  // Walrus blob IDs are base64-encoded strings
  return /^[A-Za-z0-9+/]+=*$/.test(blobId) && blobId.length > 0;
}
