import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

// Contract configuration
export const SUITTER_CONFIG = {
  PACKAGE_ID:
    "0x4ec459c5ba3cd2e9f5986ba0ad97cf285daa9607106b9440bd27938860a1684e",
  MODULE_NAME: "suit",
  REGISTRY_ID:
    "0xc0d9b31dded7c12517c0c6c54d10f2111c367d5f6202076f3bd2560ea666912c",
  // Sui shared clock object
  CLOCK_ID: "0x6",
};

// Initialize Sui client
export const suiClient = new SuiClient({
  url: "https://fullnode.devnet.sui.io:443",
});

// Types matching the Move contract
export interface Profile {
  id: string;
  owner: string;
  username: string;
  bio_cid: string;
  avatar_cid: string;
}

export interface Post {
  id: string;
  author: string;
  metadata_cid: string;
  deleted: boolean;
  comment_count: number;
}

export interface Comment {
  id: string;
  post_id: string;
  author: string;
  metadata_cid: string;
  parent_comment_id: string;
}

export interface Like {
  id: string;
  post_id: string;
  liker: string;
}

// Event types
export interface PostCreatedEvent {
  post_id: string;
  author: string;
  timestamp_ms: number;
}

export interface CommentCreatedEvent {
  comment_id: string;
  post_id: string;
  author: string;
  timestamp_ms: number;
}

export interface LikeCreatedEvent {
  like_id: string;
  post_id: string;
  liker: string;
  timestamp_ms: number;
}

// Helper to encode strings as vector<u8> for Move
export function stringToVector(str: string): number[] {
  return Array.from(new TextEncoder().encode(str));
}

// Helper to decode vector<u8> to string
export function vectorToString(vec: number[]): string {
  return new TextDecoder().decode(new Uint8Array(vec));
}

// Transaction builders for each contract function
export class SuitterTransactions {
  /**
   * Create a new post (Suit)
   */
  static createPost(text: string, mediaBlobIds: string[] = []): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${SUITTER_CONFIG.PACKAGE_ID}::${SUITTER_CONFIG.MODULE_NAME}::create_suit`,
      arguments: [
        tx.object(SUITTER_CONFIG.REGISTRY_ID), // Registry
        tx.pure.string(text),
        tx.pure.vector("string", mediaBlobIds), // Media blob IDs
        tx.object(SUITTER_CONFIG.CLOCK_ID), // Sui Clock shared object
      ],
    });

    return tx;
  }
}
