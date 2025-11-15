import { suiClient, SUITTER_CONFIG } from "./suitterContract";
import type {
  Profile,
  Post,
  Comment,
  Like,
  PostCreatedEvent,
} from "./suitterContract";

/**
 * Query service for reading data from the Suitter contract
 */
export class SuitterQueries {
  /**
   * Get user profile by owner address
   */
  static async getProfileByOwner(
    ownerAddress: string,
  ): Promise<Profile | null> {
    try {
      const objects = await suiClient.getOwnedObjects({
        owner: ownerAddress,
        filter: {
          StructType: `${SUITTER_CONFIG.PACKAGE_ID}::${SUITTER_CONFIG.MODULE_NAME}::Profile`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (objects.data.length === 0) return null;

      const profileData = objects.data[0].data;
      if (
        !profileData ||
        !profileData.content ||
        profileData.content.dataType !== "moveObject"
      ) {
        return null;
      }

      const fields = profileData.content.fields as any;
      return {
        id: fields.id.id,
        owner: fields.owner,
        username: this.decodeVectorU8(fields.username),
        bio_cid: this.decodeVectorU8(fields.bio_cid),
        avatar_cid: this.decodeVectorU8(fields.avatar_cid),
      };
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }

  /**
   * Get a specific post by ID
   */
  static async getPost(postId: string): Promise<Post | null> {
    try {
      const object = await suiClient.getObject({
        id: postId,
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (
        !object.data ||
        !object.data.content ||
        object.data.content.dataType !== "moveObject"
      ) {
        return null;
      }

      const fields = object.data.content.fields as any;
      return {
        id: fields.id.id,
        author: fields.author,
        metadata_cid: this.decodeVectorU8(fields.metadata_cid),
        deleted: fields.deleted,
        comment_count: parseInt(fields.comment_count),
      };
    } catch (error) {
      console.error("Error fetching post:", error);
      return null;
    }
  }

  /**
   * Get all posts by a user (suits filtered by owner)
   */
  static async getPostsByAuthor(authorAddress: string): Promise<Post[]> {
    try {
      // Get all SuitCreated events
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${SUITTER_CONFIG.PACKAGE_ID}::${SUITTER_CONFIG.MODULE_NAME}::SuitCreated`,
        },
        limit: 100,
        order: "descending",
      });

      // Filter events for this specific author
      const authorEvents = events.data.filter(
        (event) => (event.parsedJson as any).owner === authorAddress
      );

      if (authorEvents.length === 0) {
        return [];
      }

      // Extract suit IDs from filtered events
      const suitIds = authorEvents.map(
        (event) => (event.parsedJson as any).suit_id
      );

      // Fetch all suit objects
      const suits = await suiClient.multiGetObjects({
        ids: suitIds,
        options: { showContent: true },
      });

      // Map to Post format for compatibility
      return suits
        .filter((obj) => obj.data?.content && "fields" in obj.data.content)
        .map((obj) => {
          const fields = (obj.data!.content as any).fields;
          return {
            id: fields.id.id,
            author: fields.owner, // suit uses 'owner' field
            metadata_cid: fields.text, // suit uses 'text' field directly
            deleted: false, // simple contract doesn't support deletion
            comment_count: 0, // simple contract doesn't support comments
          };
        });
    } catch (error) {
      console.error("Error fetching posts by author:", error);
      return [];
    }
  }

  /**
   * Get comments for a post
   */
  static async getCommentsByPost(postId: string): Promise<Comment[]> {
    try {
      // Query events to find all comments for this post
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${SUITTER_CONFIG.PACKAGE_ID}::${SUITTER_CONFIG.MODULE_NAME}::CommentCreatedEvent`,
        },
      });

      const commentIds = events.data
        .filter((event) => (event.parsedJson as any).post_id === postId)
        .map((event) => (event.parsedJson as any).comment_id);

      // Fetch each comment object
      const comments: Comment[] = [];
      for (const commentId of commentIds) {
        const comment = await this.getComment(commentId);
        if (comment && comment.post_id === postId) {
          comments.push(comment);
        }
      }

      return comments;
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  }

  /**
   * Get a specific comment
   */
  static async getComment(commentId: string): Promise<Comment | null> {
    try {
      const object = await suiClient.getObject({
        id: commentId,
        options: {
          showContent: true,
        },
      });

      if (
        !object.data ||
        !object.data.content ||
        object.data.content.dataType !== "moveObject"
      ) {
        return null;
      }

      const fields = object.data.content.fields as any;
      return {
        id: fields.id.id,
        post_id: fields.post_id,
        author: fields.author,
        metadata_cid: this.decodeVectorU8(fields.metadata_cid),
        parent_comment_id: fields.parent_comment_id,
      };
    } catch (error) {
      console.error("Error fetching comment:", error);
      return null;
    }
  }

  /**
   * Get likes for a post
   */
  static async getLikesByPost(postId: string): Promise<Like[]> {
    try {
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${SUITTER_CONFIG.PACKAGE_ID}::${SUITTER_CONFIG.MODULE_NAME}::LikeCreatedEvent`,
        },
      });

      const likeIds = events.data
        .filter((event) => (event.parsedJson as any).post_id === postId)
        .map((event) => (event.parsedJson as any).like_id);

      const likes: Like[] = [];
      for (const likeId of likeIds) {
        const like = await this.getLike(likeId);
        if (like && like.post_id === postId) {
          likes.push(like);
        }
      }

      return likes;
    } catch (error) {
      console.error("Error fetching likes:", error);
      return [];
    }
  }

  /**
   * Get a specific like
   */
  static async getLike(likeId: string): Promise<Like | null> {
    try {
      const object = await suiClient.getObject({
        id: likeId,
        options: {
          showContent: true,
        },
      });

      if (
        !object.data ||
        !object.data.content ||
        object.data.content.dataType !== "moveObject"
      ) {
        return null;
      }

      const fields = object.data.content.fields as any;
      return {
        id: fields.id.id,
        post_id: fields.post_id,
        liker: fields.liker,
      };
    } catch (error) {
      console.error("Error fetching like:", error);
      return null;
    }
  }

  /**
   * Check if user has liked a post
   */
  static async hasUserLikedPost(
    userAddress: string,
    postId: string,
  ): Promise<{ liked: boolean; likeId?: string }> {
    try {
      const objects = await suiClient.getOwnedObjects({
        owner: userAddress,
        filter: {
          StructType: `${SUITTER_CONFIG.PACKAGE_ID}::${SUITTER_CONFIG.MODULE_NAME}::Like`,
        },
        options: {
          showContent: true,
        },
      });

      const like = objects.data.find((obj) => {
        if (obj.data?.content?.dataType === "moveObject") {
          const fields = (obj.data.content as any).fields;
          return fields.post_id === postId;
        }
        return false;
      });

      if (like && like.data?.content?.dataType === "moveObject") {
        const fields = (like.data.content as any).fields;
        return { liked: true, likeId: fields.id.id };
      }

      return { liked: false };
    } catch (error) {
      console.error("Error checking like status:", error);
      return { liked: false };
    }
  }

  /**
   * Get recent posts (using events)
   */
  static async getRecentPosts(limit = 50): Promise<PostCreatedEvent[]> {
    try {
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${SUITTER_CONFIG.PACKAGE_ID}::${SUITTER_CONFIG.MODULE_NAME}::PostCreatedEvent`,
        },
        limit,
        order: "descending",
      });

      return events.data.map((event) => event.parsedJson as PostCreatedEvent);
    } catch (error) {
      console.error("Error fetching recent posts:", error);
      return [];
    }
  }

  /**
   * Get all suits from the registry using dynamic fields
   */
  static async getAllSuitsFromRegistry(): Promise<Post[]> {
    try {
      // Get the registry object
      const registry = await suiClient.getObject({
        id: SUITTER_CONFIG.REGISTRY_ID,
        options: { showContent: true },
      });

      if (
        !registry.data?.content ||
        registry.data.content.dataType !== "moveObject"
      ) {
        console.error("Invalid registry object");
        return [];
      }

      const registryFields = registry.data.content.fields as any;

      // Get the table ID from the registry
      const tableId = registryFields.suits?.fields?.id?.id;

      if (!tableId) {
        console.warn("No suits table found in registry");
        return [];
      }

      // Get all dynamic fields (suit entries) from the table
      const tableEntries = await suiClient.getDynamicFields({
        parentId: tableId,
      });

      const ids: string[] = [];

      // Extract the suit post IDs from each dynamic field
      for (const entry of tableEntries.data) {
        const item = await suiClient.getDynamicFieldObject({
          parentId: tableId,
          name: entry.name,
        });

        if (item.data?.content && item.data.content.dataType === "moveObject") {
          const fields = item.data.content.fields as any;
          const idx = fields.name || fields.value;
          if (idx) {
            ids.push(idx);
          }
        }
      }

      if (ids.length === 0) {
        return [];
      }

      // Fetch all suit post objects
      const suitPosts = await suiClient.multiGetObjects({
        ids,
        options: { showContent: true, showOwner: true },
      });

      // Map to Post format
      const posts: Post[] = [];
      for (const obj of suitPosts) {
        if (obj.data?.content && obj.data.content.dataType === "moveObject") {
          const fields = obj.data.content.fields as any;
          posts.push({
            id: fields.id.id,
            author: fields.author,
            metadata_cid: this.decodeVectorU8(fields.metadata_cid),
            deleted: fields.deleted,
            comment_count: Number(fields.comment_count || 0),
          });
        }
      }

      return posts;
    } catch (error) {
      console.error("Error fetching suits from registry:", error);
      return [];
    }
  }

  /**
   * Helper to decode vector<u8> to string
   */
  private static decodeVectorU8(vec: number[] | string): string {
    if (typeof vec === "string") return vec;
    return new TextDecoder().decode(new Uint8Array(vec));
  }
}
