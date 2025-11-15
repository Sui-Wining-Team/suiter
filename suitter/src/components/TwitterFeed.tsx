import { useState, useEffect, useRef } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { usePost, useLike, useComment } from "@/hooks/useSuitterContract";
import { useReadSuits } from "@/hooks/useReadSuits";
import { ComposeTweet } from "./ComposeTweet";
import { TweetCard } from "./TweetCard";
import { CommentModal } from "./CommentModal";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCw, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface TwitterFeedProps {
  onPostClick?: (postId: string) => void;
}

/**
 * Twitter-style feed component for Suitter
 */
export function TwitterFeed({ onPostClick }: TwitterFeedProps) {
  const currentAccount = useCurrentAccount();
  const { createPost, deletePost } = usePost();
  const { addComment } = useComment();
  const { likePost, unlikePost, checkLikeStatus } = useLike();

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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  // Show scroll to top button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    toast.success("Feed refreshed");
  };
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // Load like statuses for all posts
  useEffect(() => {
    const loadLikeStatuses = async () => {
      if (suits && suits.length > 0 && currentAccount) {
        console.log("🔍 Loading like statuses for posts...");
        for (const suit of suits) {
          const postId = (suit as any).id?.id || (suit as any).id;
          const status = await checkLikeStatus(postId);
          console.log(
            `💗 Post ${postId}: ${status.totalLikes} likes, isLiked: ${status.isLiked}`,
          );
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
  const handleCreatePost = async (content: string, mediaBlobIds: string[]) => {
    if (!currentAccount || !content.trim()) return;

    try {
      toast.loading("Creating post...", { id: "create-post" });

      // Pass text and media blob IDs to the contract
      await createPost(content, mediaBlobIds);

      toast.success("Post created successfully!", { id: "create-post" });

      // Refetch posts after 2 seconds to allow blockchain to update
      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post. Please try again.", {
        id: "create-post",
      });
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
      toast.error("Failed to delete post. Please try again.", {
        id: "delete-post",
      });
    }
  };

  const handleComment = async (
    postId: string,
    content: string,
    mediaBlobIds: string[],
  ) => {
    try {
      toast.loading("Adding comment...", { id: "add-comment" });
      await addComment(postId, content, mediaBlobIds);
      toast.success("Comment added!", { id: "add-comment" });

      // Refetch posts to update comment count
      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to add comment. Please try again.", {
        id: "add-comment",
      });
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
        await unlikePost(postId);
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
      toast.error("Failed to update like. Please try again.", {
        id: "toggle-like",
      });
    }
  };

  return (
    <div className="w-full" ref={feedRef}>
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-black/80 border-b border-gray-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">Home</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-full hover:bg-gray-800"
          >
            <RefreshCw
              className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
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
        <div className="space-y-4 p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-gray-800 pb-4">
              <div className="flex gap-3 animate-pulse">
                <div className="w-12 h-12 bg-gray-800 rounded-full" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-800 rounded w-1/4" />
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                  <div className="h-4 bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {suitsError && (
        <div className="p-4 text-center text-red-500">Failed to load posts</div>
      )}

      {/* Empty State */}
      {!suitsLoading && (!suits || suits.length === 0) && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-gray-600">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">No posts yet</h3>
          <p className="text-gray-500 text-center max-w-sm">
            {currentAccount
              ? "Be the first to share your thoughts with the world!"
              : "Connect your wallet to see and create posts"}
          </p>
        </div>
      )}

      {/* Posts Feed - Only show top-level posts (no parent_suit_id) */}
      {suits
        ?.filter((suit: any) => {
          // Filter out comments - only show posts without parent_suit_id
          return !suit.parent_suit_id;
        })
        .map((suit: any) => {
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
          const mediaBlobIds = suit.media_blob_ids || [];
          const timestamp = suit.timestamp
            ? parseInt(suit.timestamp)
            : Date.now();
          const timeAgo = getTimeAgo(timestamp);
          const isOwner = suit.owner === currentAccount?.address;

          // Get comment count from suit object
          const commentCount = suit.comment_count
            ? parseInt(suit.comment_count)
            : 0;

          // Get like status from the likeStatuses state
          const likeStatus = likeStatuses[postId] || {};
          const likeCount = likeStatus.totalLikes || 0;
          const isLiked = likeStatus.isLiked || false;

          return (
            <TweetCard
              key={postId}
              author={suit.owner.slice(0, 6) + "..." + suit.owner.slice(-4)}
              authorAddress={suit.owner}
              content={text}
              mediaBlobIds={mediaBlobIds}
              timestamp={timeAgo}
              likes={likeCount}
              isLiked={isLiked}
              commentCount={commentCount}
              isOwner={isOwner}
              deleted={false}
              onClick={() => onPostClick?.(postId)}
              onLike={() => handleToggleLike(postId)}
              onDelete={() => handleDeletePost(postId)}
              onComment={() =>
                handleOpenCommentModal({ ...suit, id: postId, text })
              }
            />
          );
        })}

      {/* Comment Modal */}
      {selectedPost && (
        <CommentModal
          isOpen={commentModalOpen}
          onClose={() => setCommentModalOpen(false)}
          onComment={(content, mediaBlobIds) =>
            handleComment(selectedPost.id, content, mediaBlobIds)
          }
          postAuthor={
            selectedPost.owner?.slice(0, 6) +
              "..." +
              selectedPost.owner?.slice(-4) || "Unknown"
          }
          postContent={selectedPost.text || ""}
          postTimestamp={getTimeAgo(selectedPost.timestamp || Date.now())}
        />
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-8 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
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
