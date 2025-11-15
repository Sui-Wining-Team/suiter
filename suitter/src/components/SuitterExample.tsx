import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import {
  useProfile,
  usePost,
  useComment,
  useLike,
} from "../hooks/useSuitterContract";
import { Heart, MessageCircle, Edit, Trash2, Send } from "lucide-react";

/**
 * Example component showing how to use the Suitter contract integration
 * This demonstrates all major features: profiles, posts, comments, and likes
 */
export function SuitterExample() {
  const currentAccount = useCurrentAccount();

  // Hook instances
  const { createProfile, getProfile, loading: profileLoading } = useProfile();
  const {
    createPost,
    getUserPosts,
    deletePost,
    loading: postLoading,
  } = usePost();
  const { addComment, getComments, loading: commentLoading } = useComment();
  const {
    likePost,
    unlikePost,
    checkLikeStatus,
    getLikes,
    loading: likeLoading,
  } = useLike();

  // State
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
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
      loadPosts();
    }
  }, [currentAccount]);

  const loadProfile = async () => {
    const userProfile = await getProfile();
    setProfile(userProfile);
  };

  const loadPosts = async () => {
    const userPosts = await getUserPosts();
    setPosts(userPosts);

    // Load like statuses for all posts
    for (const post of userPosts) {
      const status = await checkLikeStatus(post.id);
      setLikeStatuses((prev) => ({ ...prev, [post.id]: status }));
    }
  };

  const loadComments = async (postId: string) => {
    const postComments = await getComments(postId);
    setComments(postComments);
  };

  // Handlers
  const handleCreateProfile = async () => {
    if (!username) return;

    // In production, upload bio and avatar to IPFS/Walrus and use the CID
    const bioCid = bio || "placeholder-bio-cid";
    const avatarCid = "placeholder-avatar-cid";

    await createProfile(username, bioCid, avatarCid);
    await loadProfile();
    setUsername("");
    setBio("");
  };

  const handleCreatePost = async () => {
    if (!postContent) return;

    // In production, upload content to IPFS/Walrus and use the CID
    const metadataCid = JSON.stringify({
      text: postContent,
      timestamp: Date.now(),
    });

    await createPost(metadataCid);
    await loadPosts();
    setPostContent("");
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId);
      await loadPosts();
    }
  };

  const handleLikeToggle = async (postId: string) => {
    const status = likeStatuses[postId];

    if (status?.liked && status.likeId) {
      await unlikePost(status.likeId);
    } else {
      await likePost(postId);
    }

    // Reload like status
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

      {/* Posts List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Suits</h2>

        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet. Create your first Suit!</p>
        ) : (
          posts.map((post) => {
            const metadata = JSON.parse(post.metadata_cid);
            const isLiked = likeStatuses[post.id]?.liked;

            return (
              <div key={post.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-gray-800 mb-2">{metadata.text}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(metadata.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex gap-4 border-t pt-4">
                  <button
                    onClick={() => handleLikeToggle(post.id)}
                    disabled={likeLoading}
                    className={`flex items-center gap-2 ${isLiked ? "text-red-500" : "text-gray-600"} hover:text-red-500`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                    />
                    <span>Like</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPost(post.id);
                      loadComments(post.id);
                    }}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comment_count} Comments</span>
                  </button>
                </div>

                {/* Comments Section */}
                {selectedPost === post.id && (
                  <div className="mt-4 border-t pt-4 space-y-4">
                    {comments.map((comment) => {
                      const commentMeta = JSON.parse(comment.metadata_cid);
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
