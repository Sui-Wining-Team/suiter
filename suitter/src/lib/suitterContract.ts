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
export interface Suit {
  id: { id: string };
  text: string;
  owner: string;
  timestamp: string;
  media_blob_ids: string[];
  likes: { contents: string[] };
  reshare_count: string;
  comment_count: string;
  is_reshare: boolean;
  reshared_suit_id: { vec: any[] };
  parent_suit_id: { vec: any[] };
}

export interface Profile {
  id: string;
  owner: string;
  username: string;
  name: string;
  bio: string;
  avatar_blob_id: string;
  created_at: string;
}

// Legacy types for compatibility
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
export interface SuitCreatedEvent {
  suit_id: string;
  text: string;
  owner: string;
  timestamp: number;
  is_reshare: boolean;
  reshared_suit_id: { vec: any[] };
  parent_suit_id: { vec: any[] };
}

export interface SuitLikedEvent {
  suit_id: string;
  liker: string;
  timestamp: number;
}

export interface SuitUnlikedEvent {
  suit_id: string;
  unliker: string;
  timestamp: number;
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
   * Like a suit
   */
  static likeSuit(suitId: string): Transaction {
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
   * Unlike a suit
   */
  static unlikeSuit(suitId: string): Transaction {
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
   * Create a comment on a suit
   */
  static createComment(
    suitId: string,
    text: string,
    mediaBlobIds: string[] = []
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
   * Update a suit
   */
  static updatePost(suitId: string, newText: string): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${SUITTER_CONFIG.PACKAGE_ID}::${SUITTER_CONFIG.MODULE_NAME}::update_suit`,
      arguments: [
        tx.object(suitId), // Suit to update
        tx.pure.string(newText),
        tx.object(SUITTER_CONFIG.CLOCK_ID), // Clock
      ],
    });

    return tx;
  }

  /**
   * Delete a suit
   */
  static deletePost(suitId: string): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${SUITTER_CONFIG.PACKAGE_ID}::${SUITTER_CONFIG.MODULE_NAME}::delete_suit`,
      arguments: [
        tx.object(SUITTER_CONFIG.REGISTRY_ID), // Registry
        tx.object(suitId), // Suit to delete
        tx.object(SUITTER_CONFIG.CLOCK_ID), // Clock
      ],
    });

    return tx;
  }

  /**
   * Reshare a suit
   */
  static resharePost(originalSuitId: string, comment: string = ""): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${SUITTER_CONFIG.PACKAGE_ID}::${SUITTER_CONFIG.MODULE_NAME}::reshare_suit`,
      arguments: [
        tx.object(SUITTER_CONFIG.REGISTRY_ID), // Registry
        tx.object(originalSuitId), // Original suit to reshare
        tx.pure.string(comment),
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
      target: `${SUITTER_CONFIG.PACKAGE_ID}::suit_profile::create_user_profile`,
      arguments: [
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
