import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import {
  useProfile,
  usePost,
  useComment,
  useLike,
} from "../hooks/useSuitterContract";
import { useReadSuits } from "../hooks/useReadSuits";
import { Heart, MessageCircle, Trash2, Send, RefreshCw } from "lucide-react";

/**
 * Suitter feed component that displays all posts from the registry
 * Uses the registry-based approach to fetch all suits
 */
export function SuitterFeed() {
  const currentAccount = useCurrentAccount();

  // Hooks
  const { createProfile, getProfile, loading: profileLoading } = useProfile();
  const { createPost, deletePost, loading: postLoading } = usePost();
  const { addComment, getComments, loading: commentLoading } = useComment();
  const {
    likePost,
    unlikePost,
    checkLikeStatus,
    loading: likeLoading,
  } = useLike();

  // Use the registry-based hook to get all suits
  const {
    data: suits,
    isLoading: suitsLoading,
    error: suitsError,
    refetch,
  } = useReadSuits();

  // State
  const [profile, setProfile] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [likeStatuses, setLikeStatuses] = useState<Record<string, any>>({});

  // Form states
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [postContent, setPostContent] = useState("");
  const [commentContent, setCommentContent] = useState("");

  // Load user profile
  useEffect(() => {
    if (currentAccount) {
      loadProfile();
    }
  }, [currentAccount]);

  // Load like statuses when suits are loaded
  useEffect(() => {
    if (suits && suits.length > 0 && currentAccount) {
      loadLikeStatuses();
    }
  }, [suits, currentAccount]);

  const loadProfile = async () => {
    const userProfile = await getProfile();
    setProfile(userProfile);
  };

  const loadLikeStatuses = async () => {
    if (!suits || !currentAccount) return;

    for (const suit of suits) {
      const postId = suit.id?.id || suit.id;
      const status = await checkLikeStatus(postId);
      setLikeStatuses((prev) => ({ ...prev, [postId]: status }));
    }
  };

  const decodeMetadata = (vec: any): string => {
    if (typeof vec === "string") return vec;
    if (Array.isArray(vec)) {
      return new TextDecoder().decode(new Uint8Array(vec));
    }
    return "";
  };

  const loadComments = async (postId: string) => {
    const postComments = await getComments(postId);
    setComments(postComments);
  };

  // Handlers
  const handleCreateProfile = async () => {
    if (!username) return;

    const bioCid = bio || "placeholder-bio-cid";
    const avatarCid = "placeholder-avatar-cid";

    await createProfile(username, bioCid, avatarCid);
    await loadProfile();
    setUsername("");
    setBio("");
  };

  const handleCreatePost = async () => {
    if (!postContent) return;

    const metadataCid = JSON.stringify({
      text: postContent,
      timestamp: Date.now(),
    });

    await createPost(metadataCid);
    setPostContent("");

    // Refetch suits from registry
    setTimeout(() => refetch(), 2000);
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId);
      setTimeout(() => refetch(), 2000);
    }
  };

  const handleLikeToggle = async (postId: string) => {
    const status = likeStatuses[postId];

    if (status?.liked && status.likeId) {
      await unlikePost(status.likeId);
    } else {
      await likePost(postId);
    }

    const newStatus = await checkLikeStatus(postId);
    setLikeStatuses((prev) => ({ ...prev, [postId]: newStatus }));
  };

  const handleAddComment = async () => {
    if (!selectedPost || !commentContent) return;

    const metadataCid = JSON.stringify({
      text: commentContent,
      timestamp: Date.now(),
    });

    await addComment(selectedPost, metadataCid);
    await loadComments(selectedPost);
    setCommentContent("");
  };

  if (!currentAccount) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">
          Please connect your wallet to use Suitter
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>

        {profile ? (
          <div className="space-y-2">
            <p>
              <strong>Username:</strong> {profile.username}
            </p>
            <p>
              <strong>Bio:</strong> {profile.bio_cid}
            </p>
            <p>
              <strong>Address:</strong> {currentAccount.address.slice(0, 10)}...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <textarea
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
            <button
              onClick={handleCreateProfile}
              disabled={profileLoading}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {profileLoading ? "Creating..." : "Create Profile"}
            </button>
          </div>
        )}
      </div>

      {/* Create Post */}
      {profile && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Create a Suit</h2>
          <textarea
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
            rows={4}
          />
          <button
            onClick={handleCreatePost}
            disabled={postLoading}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            {postLoading ? "Posting..." : "Post Suit"}
          </button>
        </div>
      )}

      {/* All Suits Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">All Suits</h2>
          <button
            onClick={refetch}
            disabled={suitsLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${suitsLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {suitsLoading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-2 text-gray-600">Loading suits...</p>
          </div>
        )}

        {suitsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Error: Failed to load suits
          </div>
        )}

        {!suitsLoading && (!suits || suits.length === 0) ? (
          <p className="text-gray-500">No suits yet. Be the first to post!</p>
        ) : (
          suits?.map((suit: any) => {
            if (!suit) return null;
            const postId = suit.id?.id || suit.id;
            let metadata;
            try {
              metadata = JSON.parse(decodeMetadata(suit.metadata_cid));
            } catch {
              metadata = {
                text: decodeMetadata(suit.metadata_cid),
                timestamp: Date.now(),
              };
            }
            const isLiked = likeStatuses[postId]?.liked;
            const isMyPost =
              currentAccount && suit.author === currentAccount.address;

            return (
              <div key={postId} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm text-gray-500 font-mono">
                        {suit.author.slice(0, 6)}...{suit.author.slice(-4)}
                      </p>
                      {isMyPost && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          You
                        </span>
                      )}
                      {suit.deleted && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          Deleted
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 mb-2">{metadata.text}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(metadata.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {isMyPost && !suit.deleted && (
                    <button
                      onClick={() => handleDeletePost(postId)}
                      className="text-red-500 hover:text-red-700 ml-4"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="flex gap-4 border-t pt-4">
                  <button
                    onClick={() => handleLikeToggle(postId)}
                    disabled={likeLoading || !currentAccount}
                    className={`flex items-center gap-2 ${isLiked ? "text-red-500" : "text-gray-600"} hover:text-red-500 disabled:opacity-50`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                    />
                    <span>Like</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPost(postId);
                      loadComments(postId);
                    }}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{suit.comment_count || 0} Comments</span>
                  </button>
                </div>

                {/* Comments Section */}
                {selectedPost === postId && (
                  <div className="mt-4 border-t pt-4 space-y-4">
                    {comments.map((comment) => {
                      let commentMeta;
                      try {
                        commentMeta = JSON.parse(comment.metadata_cid);
                      } catch {
                        commentMeta = {
                          text: comment.metadata_cid,
                          timestamp: Date.now(),
                        };
                      }
                      return (
                        <div
                          key={comment.id}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <p className="text-sm text-gray-800">
                            {commentMeta.text}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {comment.author.slice(0, 10)}... •{" "}
                            {new Date(commentMeta.timestamp).toLocaleString()}
                          </p>
                        </div>
                      );
                    })}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg"
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={commentLoading}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
