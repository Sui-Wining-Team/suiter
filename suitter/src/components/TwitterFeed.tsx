import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { usePost, useLike, useComment } from "@/hooks/useSuitterContract";
import { useReadSuits } from "@/hooks/useReadSuits";
import { ComposeTweet } from "./ComposeTweet";
import { TweetCard } from "./TweetCard";
import { CommentModal } from "./CommentModal";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Twitter-style feed component for Suitter
 */
export function TwitterFeed() {
  const currentAccount = useCurrentAccount();
  const { createPost, deletePost } = usePost();
  const { addComment } = useComment();
  const {
    likePost,
    unlikePost,
    checkLikeStatus,
  } = useLike();

  // Use the registry-based hook to get all suits
  const {
    data: suits,
    isLoading: suitsLoading,
    error: suitsError,
    refetch,
  } = useReadSuits();

  // Debug: Log the suits data
  useEffect(() => {
    if (suits) {
      console.log("📦 Suits data from blockchain:", suits);
      console.log("📊 Number of posts:", suits.length);
      if (suits.length > 0) {
        console.log("🔍 First post structure:", suits[0]);
      }
    }
  }, [suits]);

  const [likeStatuses, setLikeStatuses] = useState<Record<string, any>>({});
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // Load like statuses for all posts
  useEffect(() => {
    const loadLikeStatuses = async () => {
      if (suits && suits.length > 0 && currentAccount) {
        for (const suit of suits) {
          const postId = (suit as any).id?.id || (suit as any).id;
          const status = await checkLikeStatus(postId);
          setLikeStatuses((prev) => ({
            ...prev,
            [postId]: status,
          }));
        }
      }
    };

    loadLikeStatuses();
  }, [suits, currentAccount]);

  // Handle creating a post
  const handleCreatePost = async (content: string) => {
    if (!currentAccount || !content.trim()) return;

    try {
      toast.loading("Creating post...", { id: "create-post" });
      
      // Pass text directly to the contract
      await createPost(content);
      
      toast.success("Post created successfully!", { id: "create-post" });

      // Refetch posts after 2 seconds to allow blockchain to update
      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post. Please try again.", { id: "create-post" });
    }
  };

  // Handle deleting a post
  const handleDeletePost = async (postId: string) => {
    try {
      toast.loading("Deleting post...", { id: "delete-post" });
      await deletePost(postId);
      toast.success("Post deleted successfully!", { id: "delete-post" });

      // Refetch posts after 2 seconds
      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post. Please try again.", { id: "delete-post" });
    }
  };

  // Handle adding a comment
  const handleComment = async (postId: string, content: string) => {
    try {
      const metadata = {
        text: content,
        timestamp: Date.now(),
        version: "1.0",
      };
      const metadataCid = JSON.stringify(metadata);

      toast.loading("Adding comment...", { id: "add-comment" });
      await addComment(postId, metadataCid);
      toast.success("Comment added!", { id: "add-comment" });

      // Refetch posts to update comment count
      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to add comment. Please try again.", { id: "add-comment" });
    }
  };

  // Handle opening comment modal
  const handleOpenCommentModal = (post: any) => {
    setSelectedPost(post);
    setCommentModalOpen(true);
  };

  // Handle liking/unliking a post
  const handleToggleLike = async (postId: string) => {
    const status = likeStatuses[postId];

    try {
      if (status?.isLiked) {
        toast.loading("Removing like...", { id: "toggle-like" });
        await unlikePost(status.likeObjectId);
        toast.success("Like removed!", { id: "toggle-like" });
      } else {
        toast.loading("Liking post...", { id: "toggle-like" });
        await likePost(postId);
        toast.success("Post liked!", { id: "toggle-like" });
      }

      // Update local status immediately for better UX
      const newStatus = await checkLikeStatus(postId);
      setLikeStatuses((prev) => ({
        ...prev,
        [postId]: newStatus,
      }));
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast.error("Failed to update like. Please try again.", { id: "toggle-like" });
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-black/80 border-b border-gray-800">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold">Home</h1>
        </div>
        <div className="flex border-b border-gray-800">
          <button className="flex-1 py-4 text-center hover:bg-gray-900 transition-colors border-b-4 border-blue-500 font-semibold">
            For you
          </button>
          <button className="flex-1 py-4 text-center hover:bg-gray-900 transition-colors text-gray-500">
            Following
          </button>
        </div>
      </div>

      {/* Compose Tweet */}
      <ComposeTweet onPost={handleCreatePost} />

      <Separator className="bg-gray-800" />

      {/* Loading State */}
      {suitsLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Error State */}
      {suitsError && (
        <div className="p-4 text-center text-red-500">Failed to load posts</div>
      )}

      {/* Empty State */}
      {!suitsLoading && (!suits || suits.length === 0) && (
        <div className="p-12 text-center">
          <p className="text-gray-500 text-lg">No posts yet.</p>
          <p className="text-gray-600 mt-2">Be the first to post!</p>
        </div>
      )}

      {/* Posts Feed */}
      {suits?.map((suit: any) => {
        if (!suit) {
          console.log("⚠️ Null suit found");
          return null;
        }

        console.log("🎯 Processing suit:", suit);
        const postId = suit.id?.id || suit.id;

        if (!postId) {
          console.log("⚠️ No post ID found");
          return null;
        }

        console.log("🆔 Post ID:", postId);

        // The simple contract stores text directly
        const text = suit.text || "No content";
        const timestamp = suit.timestamp ? parseInt(suit.timestamp) : Date.now();

        const isOwner = suit.owner === currentAccount?.address;
        const likeStatus = likeStatuses[postId] || {};
        const timeAgo = getTimeAgo(timestamp);

        return (
          <TweetCard
            key={postId}
            author={suit.owner.slice(0, 6) + "..." + suit.owner.slice(-4)}
            authorAddress={suit.owner}
            content={text}
            timestamp={timeAgo}
            likes={likeStatus.totalLikes || 0}
            isLiked={likeStatus.isLiked || false}
            commentCount={0}
            isOwner={isOwner}
            deleted={false}
            onLike={() => handleToggleLike(postId)}
            onDelete={() => handleDeletePost(postId)}
            onComment={() => handleOpenCommentModal({ ...suit, id: postId, text })}
          />
        );
      })}

      {/* Comment Modal */}
      {selectedPost && (
        <CommentModal
          isOpen={commentModalOpen}
          onClose={() => setCommentModalOpen(false)}
          onComment={(content) => handleComment(selectedPost.id, content)}
          postAuthor={selectedPost.owner?.slice(0, 6) + "..." + selectedPost.owner?.slice(-4) || "Unknown"}
          postContent={selectedPost.text || ""}
          postTimestamp={getTimeAgo(selectedPost.timestamp || Date.now())}
        />
      )}
    </div>
  );
}

// Helper function to format timestamp
function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return "now";
}
