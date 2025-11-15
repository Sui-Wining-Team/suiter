import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useLike, useComment } from "@/hooks/useSuitterContract";
import { useReadSuits } from "@/hooks/useReadSuits";
import { TweetCard } from "./TweetCard";
import { CommentModal } from "./CommentModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PostDetailsProps {
  postId: string;
  onBack: () => void;
}

interface CommentNode {
  comment: any;
  children: CommentNode[];
  depth: number;
}

export function PostDetails({ postId, onBack }: PostDetailsProps) {
  const currentAccount = useCurrentAccount();
  const { likePost, unlikePost, checkLikeStatus } = useLike();
  const { addComment } = useComment();
  const { data: suits, isLoading, refetch } = useReadSuits();

  const [likeStatuses, setLikeStatuses] = useState<Record<string, any>>({});
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [replyToComment, setReplyToComment] = useState<any>(null);

  // Find the main post
  const mainPost = suits?.find((suit: any) => {
    const suitId = suit.id?.id || suit.id;
    return suitId === postId;
  }) as any;

  // Build comment tree structure
  const buildCommentTree = (
    parentId: string,
    depth: number = 0,
  ): CommentNode[] => {
    const directChildren = (suits || []).filter((suit: any) => {
      return suit.parent_suit_id === parentId;
    });

    return directChildren.map((comment: any) => {
      const commentId = comment.id?.id || comment.id;
      return {
        comment,
        children: buildCommentTree(commentId, depth + 1),
        depth,
      };
    });
  };

  const commentTree = mainPost
    ? buildCommentTree(mainPost.id?.id || mainPost.id)
    : [];

  // Flatten tree for like status loading
  const flattenComments = (nodes: CommentNode[]): any[] => {
    return nodes.reduce((acc: any[], node) => {
      return [...acc, node.comment, ...flattenComments(node.children)];
    }, []);
  };

  const allComments = flattenComments(commentTree);

  // Load like statuses
  useEffect(() => {
    const loadLikeStatuses = async () => {
      if (currentAccount && mainPost) {
        const mainPostId = mainPost.id?.id || mainPost.id;
        const status = await checkLikeStatus(mainPostId);
        setLikeStatuses((prev) => ({ ...prev, [mainPostId]: status }));

        // Load like statuses for all comments
        for (const comment of allComments) {
          const commentId = comment.id?.id || comment.id;
          const commentStatus = await checkLikeStatus(commentId);
          setLikeStatuses((prev) => ({ ...prev, [commentId]: commentStatus }));
        }
      }
    };

    loadLikeStatuses();
  }, [suits, currentAccount, postId]);

  const handleToggleLike = async (suitId: string) => {
    const status = likeStatuses[suitId];

    try {
      if (status?.isLiked) {
        toast.loading("Removing like...", { id: "toggle-like" });
        await unlikePost(suitId);
        toast.success("Like removed!", { id: "toggle-like" });
      } else {
        toast.loading("Liking post...", { id: "toggle-like" });
        await likePost(suitId);
        toast.success("Post liked!", { id: "toggle-like" });
      }

      const newStatus = await checkLikeStatus(suitId);
      setLikeStatuses((prev) => ({ ...prev, [suitId]: newStatus }));
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast.error("Failed to update like.", { id: "toggle-like" });
    }
  };

  const handleComment = async (content: string, mediaBlobIds: string[]) => {
    try {
      const targetId = replyToComment
        ? replyToComment.id?.id || replyToComment.id
        : postId;

      toast.loading("Adding comment...", { id: "add-comment" });
      await addComment(targetId, content, mediaBlobIds);
      toast.success("Comment added!", { id: "add-comment" });

      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to add comment.", { id: "add-comment" });
    }
  };

  const handleOpenCommentModal = (comment?: any) => {
    setReplyToComment(comment || null);
    setCommentModalOpen(true);
  };

  const handleCloseCommentModal = () => {
    setCommentModalOpen(false);
    setReplyToComment(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!mainPost) {
    return (
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 hover:bg-gray-900 rounded-full"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
        <div className="text-center text-gray-500 py-12">Post not found</div>
      </div>
    );
  }

  const mainPostId = mainPost.id?.id || mainPost.id;
  const text = mainPost.text || "No content";
  const mediaBlobIds = mainPost.media_blob_ids || [];
  const timestamp = mainPost.timestamp
    ? parseInt(mainPost.timestamp)
    : Date.now();
  const isOwner = mainPost.owner === currentAccount?.address;
  const likeStatus = likeStatuses[mainPostId] || {};
  const timeAgo = getTimeAgo(timestamp);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-black/80 border-b border-gray-800">
        <div className="px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="hover:bg-gray-900 rounded-full p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Post</h1>
        </div>
      </div>

      {/* Main Post */}
      <div className="border-b border-gray-800">
        <TweetCard
          author={mainPost.owner.slice(0, 6) + "..." + mainPost.owner.slice(-4)}
          authorAddress={mainPost.owner}
          content={text}
          mediaBlobIds={mediaBlobIds}
          timestamp={timeAgo}
          likes={likeStatus.totalLikes || 0}
          isLiked={likeStatus.isLiked || false}
          commentCount={parseInt(mainPost.comment_count) || 0}
          isOwner={isOwner}
          onLike={() => handleToggleLike(mainPostId)}
          onComment={() => setCommentModalOpen(true)}
        />
      </div>

      {/* Comments Section */}
      <div className="border-b-8 border-gray-900 mb-2"></div>

      {commentTree.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-500 text-lg">No comments yet</p>
          <p className="text-gray-600 mt-2">Be the first to comment!</p>
        </div>
      ) : (
        <div>
          {commentTree.map((node) => (
            <CommentThread
              key={node.comment.id?.id || node.comment.id}
              node={node}
              likeStatuses={likeStatuses}
              currentAccount={currentAccount}
              onLike={handleToggleLike}
              onReply={handleOpenCommentModal}
            />
          ))}
        </div>
      )}

      {/* Comment Modal */}
      <CommentModal
        isOpen={commentModalOpen}
        onClose={handleCloseCommentModal}
        onComment={handleComment}
        postAuthor={
          replyToComment
            ? replyToComment.owner.slice(0, 6) +
              "..." +
              replyToComment.owner.slice(-4)
            : mainPost.owner.slice(0, 6) + "..." + mainPost.owner.slice(-4)
        }
        postContent={replyToComment ? replyToComment.text : text}
        postTimestamp={
          replyToComment
            ? getTimeAgo(parseInt(replyToComment.timestamp) || Date.now())
            : timeAgo
        }
      />
    </div>
  );
}

interface CommentThreadProps {
  node: CommentNode;
  likeStatuses: Record<string, any>;
  currentAccount: any;
  onLike: (commentId: string) => void;
  onReply: (comment: any) => void;
}

function CommentThread({
  node,
  likeStatuses,
  currentAccount,
  onLike,
  onReply,
}: CommentThreadProps) {
  const { comment, children, depth } = node;
  const commentId = comment.id?.id || comment.id;
  const commentText = comment.text || "No content";
  const commentMedia = comment.media_blob_ids || [];
  const commentTimestamp = comment.timestamp
    ? parseInt(comment.timestamp)
    : Date.now();
  const commentIsOwner = comment.owner === currentAccount?.address;
  const commentLikeStatus = likeStatuses[commentId] || {};
  const commentTimeAgo = getTimeAgo(commentTimestamp);
  const commentCount = parseInt(comment.comment_count) || 0;

  // Calculate indentation (max 4 levels to prevent excessive indentation)
  const indentLevel = Math.min(depth, 4);
  const leftPadding = indentLevel * 40; // 40px per level

  return (
    <div>
      <div
        className="border-b border-gray-800 relative"
        style={{ paddingLeft: `${leftPadding}px` }}
      >
        {/* Thread line connector for nested comments */}
        {depth > 0 && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gray-800"
            style={{ left: `${leftPadding - 30}px` }}
          />
        )}

        <TweetCard
          author={comment.owner.slice(0, 6) + "..." + comment.owner.slice(-4)}
          authorAddress={comment.owner}
          content={commentText}
          mediaBlobIds={commentMedia}
          timestamp={commentTimeAgo}
          likes={commentLikeStatus.totalLikes || 0}
          isLiked={commentLikeStatus.isLiked || false}
          commentCount={commentCount}
          isOwner={commentIsOwner}
          onLike={() => onLike(commentId)}
          onComment={() => onReply(comment)}
        />
      </div>

      {/* Render nested replies */}
      {children.map((childNode) => (
        <CommentThread
          key={childNode.comment.id?.id || childNode.comment.id}
          node={childNode}
          likeStatuses={likeStatuses}
          currentAccount={currentAccount}
          onLike={onLike}
          onReply={onReply}
        />
      ))}
    </div>
  );
}

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
