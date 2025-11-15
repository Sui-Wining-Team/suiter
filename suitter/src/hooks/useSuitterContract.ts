import { useState } from "react";
import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { SuitterTransactions } from "../lib/suitterContract";
import { SuitterQueries } from "../lib/suitterQueries";
import type { Profile, Post, Comment, Like } from "../lib/suitterContract";

/**
 * Hook for creating and managing user profiles
 */
export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  const createProfile = async (
    username: string,
    name: string,
    bio: string,
    avatarBlobId: string,
  ) => {
    if (!currentAccount) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = SuitterTransactions.createProfile(
        username,
        name,
        bio,
        avatarBlobId,
      );

      await new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("Profile created:", result);
              resolve(result);
            },
            onError: (err) => {
              console.error("Error creating profile:", err);
              reject(err);
            },
          },
        );
      });
    } catch (err: any) {
      setError(err.message || "Failed to create profile");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (
    profileId: string,
    username: string,
    bioCid: string,
    avatarCid: string,
  ) => {
    if (!currentAccount) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Profile update not implemented in current contract
      console.log("Profile update not available in current contract");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async (address?: string): Promise<Profile | null> => {
    const targetAddress = address || currentAccount?.address;
    if (!targetAddress) return null;

    try {
      return await SuitterQueries.getProfileByOwner(targetAddress);
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      return null;
    }
  };

  return {
    createProfile,
    updateProfile,
    getProfile,
    loading,
    error,
  };
}

/**
 * Hook for creating and managing posts (suits)
 */
export function usePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  const createPost = async (text: string, mediaBlobIds: string[] = []) => {
    if (!currentAccount) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = SuitterTransactions.createPost(text, mediaBlobIds);

      await new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("Post created:", result);
              resolve(result);
            },
            onError: (err) => {
              console.error("Error creating post:", err);
              reject(err);
            },
          },
        );
      });
    } catch (err: any) {
      setError(err.message || "Failed to create post");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (suitId: string, newText: string) => {
    if (!currentAccount) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const txb = SuitterTransactions.updatePost(suitId, newText);

      signAndExecute(
        {
          transaction: txb,
        },
        {
          onSuccess: (result) => {
            console.log("Post updated:", result);
            setLoading(false);
          },
          onError: (error) => {
            console.error("Transaction failed:", error);
            setError(error.message);
            setLoading(false);
          },
        },
      );
    } catch (err: any) {
      setError(err.message || "Failed to update post");
      setLoading(false);
    }
  };

  const deletePost = async (suitId: string) => {
    if (!currentAccount) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const txb = SuitterTransactions.deletePost(suitId);

      signAndExecute(
        {
          transaction: txb,
        },
        {
          onSuccess: (result) => {
            console.log("Post deleted:", result);
            setLoading(false);
          },
          onError: (error) => {
            console.error("Transaction failed:", error);
            setError(error.message);
            setLoading(false);
          },
        },
      );
    } catch (err: any) {
      setError(err.message || "Failed to delete post");
      setLoading(false);
    }
  };

  const resharePost = async (originalSuitId: string, comment: string = "") => {
    if (!currentAccount) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const txb = SuitterTransactions.resharePost(originalSuitId, comment);

      signAndExecute(
        {
          transaction: txb,
        },
        {
          onSuccess: (result) => {
            console.log("Post reshared:", result);
            setLoading(false);
          },
          onError: (error) => {
            console.error("Transaction failed:", error);
            setError(error.message);
            setLoading(false);
          },
        },
      );
    } catch (err: any) {
      setError(err.message || "Failed to reshare post");
      setLoading(false);
    }
  };

  const getPost = async (postId: string): Promise<Post | null> => {
    try {
      return await SuitterQueries.getPost(postId);
    } catch (err: any) {
      console.error("Error fetching post:", err);
      return null;
    }
  };

  const getUserPosts = async (address?: string): Promise<Post[]> => {
    const targetAddress = address || currentAccount?.address;
    if (!targetAddress) return [];

    try {
      return await SuitterQueries.getPostsByAuthor(targetAddress);
    } catch (err: any) {
      console.error("Error fetching user posts:", err);
      return [];
    }
  };

  return {
    createPost,
    updatePost,
    deletePost,
    resharePost,
    getPost,
    getUserPosts,
    loading,
    error,
  };
}

/**
 * Hook for comments
 */
export function useComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  const addComment = async (
    suitId: string,
    text: string,
    mediaBlobIds: string[] = [],
  ) => {
    if (!currentAccount) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = SuitterTransactions.createComment(suitId, text, mediaBlobIds);

      await new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("Comment added:", result);
              resolve(result);
            },
            onError: (err) => {
              console.error("Error adding comment:", err);
              reject(err);
            },
          },
        );
      });
    } catch (err: any) {
      setError(err.message || "Failed to add comment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getComments = async (postId: string): Promise<Comment[]> => {
    try {
      return await SuitterQueries.getCommentsByPost(postId);
    } catch (err: any) {
      console.error("Error fetching comments:", err);
      return [];
    }
  };

  return {
    addComment,
    getComments,
    loading,
    error,
  };
}

/**
 * Hook for likes
 */
export function useLike() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  const likePost = async (suitId: string) => {
    if (!currentAccount) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = SuitterTransactions.likeSuit(suitId);

      await new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("Suit liked:", result);
              resolve(result);
            },
            onError: (err) => {
              console.error("Error liking suit:", err);
              reject(err);
            },
          },
        );
      });
    } catch (err: any) {
      setError(err.message || "Failed to like suit");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unlikePost = async (suitId: string) => {
    if (!currentAccount) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = SuitterTransactions.unlikeSuit(suitId);

      await new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("Suit unliked:", result);
              resolve(result);
            },
            onError: (err) => {
              console.error("Error unliking suit:", err);
              reject(err);
            },
          },
        );
      });
    } catch (err: any) {
      setError(err.message || "Failed to unlike suit");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkLikeStatus = async (
    suitId: string,
  ): Promise<{
    isLiked: boolean;
    likeObjectId?: string;
    totalLikes: number;
  }> => {
    if (!currentAccount) return { isLiked: false, totalLikes: 0 };

    try {
      const userLikeStatus = await SuitterQueries.hasUserLikedPost(
        currentAccount.address,
        suitId,
      );
      const allLikes = await SuitterQueries.getLikesByPost(suitId);

      return {
        isLiked: userLikeStatus.liked,
        likeObjectId: userLikeStatus.likeId,
        totalLikes: allLikes.length,
      };
    } catch (err: any) {
      console.error("Error checking like status:", err);
      return { isLiked: false, totalLikes: 0 };
    }
  };

  const getLikes = async (postId: string): Promise<Like[]> => {
    try {
      return await SuitterQueries.getLikesByPost(postId);
    } catch (err: any) {
      console.error("Error fetching likes:", err);
      return [];
    }
  };

  return {
    likePost,
    unlikePost,
    checkLikeStatus,
    getLikes,
    loading,
    error,
  };
}
