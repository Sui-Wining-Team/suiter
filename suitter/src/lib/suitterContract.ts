import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

// Contract configuration
export const SUITTER_CONFIG = {
  PACKAGE_ID:
    "0x3410da65b01707ee3f26e519784902f07b19810b298309ea1c02ea7f2add5505",
  MODULE_NAME: "suit",
  REGISTRY_ID:
    "0xfc02e2746eed968f9a9278f2fb6fa4b3b283bf485299ce161d35f72ba29654c8",
  PROFILE_REGISTRY_ID:
    "0x5528819c99c1a4d01312a0f9d4d7e9ba1ff5676007f6211b5942e45d68bc93cc",
  // Sui shared clock object
  CLOCK_ID: "0x6",
};

// Initialize Sui client
export const suiClient = new SuiClient({
  url: "https://fullnode.testnet.sui.io:443",
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

  /**
   * Create a comment on a post
   */
  static createComment(
    suitId: string,
    text: string,
    mediaBlobIds: string[] = [],
  ): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${SUITTER_CONFIG.PACKAGE_ID}::${SUITTER_CONFIG.MODULE_NAME}::create_comment`,
      arguments: [
        tx.object(SUITTER_CONFIG.REGISTRY_ID), // Registry
        tx.object(suitId), // Parent suit
        tx.pure.string(text),
        tx.pure.vector("string", mediaBlobIds), // Media blob IDs
        tx.object(SUITTER_CONFIG.CLOCK_ID), // Clock
      ],
    });

    return tx;
  }

  /**
   * Like a post
   */
  static likePost(suitId: string): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${SUITTER_CONFIG.PACKAGE_ID}::${SUITTER_CONFIG.MODULE_NAME}::like_suit`,
      arguments: [
        tx.object(SUITTER_CONFIG.REGISTRY_ID), // Registry
        tx.object(suitId), // Suit to like
        tx.object(SUITTER_CONFIG.CLOCK_ID), // Clock
      ],
    });

    return tx;
  }

  /**
   * Unlike a post
   */
  static unlikePost(suitId: string): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${SUITTER_CONFIG.PACKAGE_ID}::${SUITTER_CONFIG.MODULE_NAME}::unlike_suit`,
      arguments: [
        tx.object(SUITTER_CONFIG.REGISTRY_ID), // Registry
        tx.object(suitId), // Suit to unlike
        tx.object(SUITTER_CONFIG.CLOCK_ID), // Clock
      ],
    });

    return tx;
  }

  /**
   * Create a user profile
   */
  static createProfile(
    username: string,
    name: string,
    bio: string,
    avatarBlobId: string,
  ): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${SUITTER_CONFIG.PACKAGE_ID}::sui_profile::create_user_profile`,
      arguments: [
        tx.object(SUITTER_CONFIG.PROFILE_REGISTRY_ID), // ProfileRegistry
        tx.pure.string(username),
        tx.pure.string(name),
        tx.pure.string(bio),
        tx.pure.string(avatarBlobId),
        tx.object(SUITTER_CONFIG.CLOCK_ID), // Clock
      ],
    });

    return tx;
  }
}
