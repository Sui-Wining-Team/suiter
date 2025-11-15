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
      const tx = SuitterTransactions.createProfile(username, bioCid, avatarCid);

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
      const tx = SuitterTransactions.updateProfile(
        profileId,
        username,
        bioCid,
        avatarCid,
      );

      await new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("Profile updated:", result);
              resolve(result);
            },
            onError: (err) => {
              console.error("Error updating profile:", err);
              reject(err);
            },
          },
        );
      });
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
 * Hook for creating and managing posts
 */
export function usePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  const createPost = async (text: string) => {
    if (!currentAccount) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = SuitterTransactions.createPost(text);

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
    } finally {
      setLoading(false);
    }
  };

  const editPost = async (postId: string, newMetadataCid: string) => {
    if (!currentAccount) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = SuitterTransactions.editPost(postId, newMetadataCid);

      await new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("Post edited:", result);
              resolve(result);
            },
            onError: (err) => {
              console.error("Error editing post:", err);
              reject(err);
            },
          },
        );
      });
    } catch (err: any) {
      setError(err.message || "Failed to edit post");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!currentAccount) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = SuitterTransactions.deletePost(postId);

      await new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("Post deleted:", result);
              resolve(result);
            },
            onError: (err) => {
              console.error("Error deleting post:", err);
              reject(err);
            },
          },
        );
      });
    } catch (err: any) {
      setError(err.message || "Failed to delete post");
    } finally {
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
    editPost,
    deletePost,
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
    postId: string,
    metadataCid: string,
    parentCommentId?: string,
  ) => {
    if (!currentAccount) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = SuitterTransactions.addComment(
        postId,
        metadataCid,
        parentCommentId,
      );

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

  const likePost = async (postId: string) => {
    if (!currentAccount) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = SuitterTransactions.likePost(postId);

      await new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("Post liked:", result);
              resolve(result);
            },
            onError: (err) => {
              console.error("Error liking post:", err);
              reject(err);
            },
          },
        );
      });
    } catch (err: any) {
      setError(err.message || "Failed to like post");
    } finally {
      setLoading(false);
    }
  };

  const unlikePost = async (likeId: string) => {
    if (!currentAccount) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = SuitterTransactions.unlikePost(likeId);

      await new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("Post unliked:", result);
              resolve(result);
            },
            onError: (err) => {
              console.error("Error unliking post:", err);
              reject(err);
            },
          },
        );
      });
    } catch (err: any) {
      setError(err.message || "Failed to unlike post");
    } finally {
      setLoading(false);
    }
  };

  const checkLikeStatus = async (
    postId: string,
  ): Promise<{
    isLiked: boolean;
    likeObjectId?: string;
    totalLikes: number;
  }> => {
    if (!currentAccount) return { isLiked: false, totalLikes: 0 };

    try {
      const userLikeStatus = await SuitterQueries.hasUserLikedPost(
        currentAccount.address,
        postId,
      );
      const allLikes = await SuitterQueries.getLikesByPost(postId);

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
