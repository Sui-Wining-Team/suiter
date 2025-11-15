import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import {
  usePost,
  useLike,
  useProfile,
  useComment,
} from "@/hooks/useSuitterContract";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SUITTER_CONFIG } from "@/lib/suitterContract";

/**
 * Debug panel for testing contract interactions
 * Remove this component in production
 */
export function DebugPanel() {
  const currentAccount = useCurrentAccount();
  const { createPost } = usePost();
  const { likePost } = useLike();
  const { createProfile } = useProfile();
  const { addComment } = useComment();

  const [testContent, setTestContent] = useState(
    "This is a test post from the debug panel!",
  );
  const [username, setUsername] = useState("TestUser");
  const [postIdForLike, setPostIdForLike] = useState("");
  const [postIdForComment, setPostIdForComment] = useState("");
  const [commentText, setCommentText] = useState("Great post!");

  const handleTestPost = async () => {
    try {
      toast.loading("Creating test post...", { id: "test-post" });
      await createPost(testContent);
      toast.success("Test post created!", { id: "test-post" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create test post", { id: "test-post" });
    }
  };

  const handleTestProfile = async () => {
    try {
      toast.loading("Creating profile...", { id: "test-profile" });
      await createProfile(
        username,
        "bio-cid-placeholder",
        "avatar-cid-placeholder",
      );
      toast.success("Profile created!", { id: "test-profile" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create profile", { id: "test-profile" });
    }
  };

  const handleTestLike = async () => {
    if (!postIdForLike) {
      toast.error("Please enter a post ID");
      return;
    }

    try {
      toast.loading("Liking post...", { id: "test-like" });
      await likePost(postIdForLike);
      toast.success("Post liked!", { id: "test-like" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to like post", { id: "test-like" });
    }
  };

  const handleTestComment = async () => {
    if (!postIdForComment) {
      toast.error("Please enter a post ID");
      return;
    }

    try {
      const metadata = JSON.stringify({
        text: commentText,
        timestamp: Date.now(),
        version: "1.0",
      });

      toast.loading("Adding comment...", { id: "test-comment" });
      await addComment(postIdForComment, metadata);
      toast.success("Comment added!", { id: "test-comment" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment", { id: "test-comment" });
    }
  };

  if (!currentAccount) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 bg-gray-900 border-gray-700 text-white z-50 max-h-[80vh] overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-sm">🔧 Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-xs">
        {/* Contract Info */}
        <div className="p-2 bg-gray-800 rounded">
          <p className="font-semibold mb-1">Contract Info:</p>
          <p className="text-gray-400 break-all">
            Package: {SUITTER_CONFIG.PACKAGE_ID.slice(0, 20)}...
          </p>
          <p className="text-gray-400">Network: Testnet</p>
        </div>

        {/* Test Post */}
        <div className="space-y-2">
          <p className="font-semibold">Test Create Post:</p>
          <Input
            value={testContent}
            onChange={(e) => setTestContent(e.target.value)}
            placeholder="Post content"
            className="bg-gray-800 border-gray-700"
          />
          <Button onClick={handleTestPost} size="sm" className="w-full">
            Create Test Post
          </Button>
        </div>

        {/* Test Profile */}
        <div className="space-y-2">
          <p className="font-semibold">Test Create Profile:</p>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="bg-gray-800 border-gray-700"
          />
          <Button onClick={handleTestProfile} size="sm" className="w-full">
            Create Profile
          </Button>
        </div>

        {/* Test Like */}
        <div className="space-y-2">
          <p className="font-semibold">Test Like Post:</p>
          <Input
            value={postIdForLike}
            onChange={(e) => setPostIdForLike(e.target.value)}
            placeholder="Post ID"
            className="bg-gray-800 border-gray-700"
          />
          <Button onClick={handleTestLike} size="sm" className="w-full">
            Like Post
          </Button>
        </div>

        {/* Test Comment */}
        <div className="space-y-2">
          <p className="font-semibold">Test Add Comment:</p>
          <Input
            value={postIdForComment}
            onChange={(e) => setPostIdForComment(e.target.value)}
            placeholder="Post ID"
            className="bg-gray-800 border-gray-700"
          />
          <Input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Comment text"
            className="bg-gray-800 border-gray-700"
          />
          <Button onClick={handleTestComment} size="sm" className="w-full">
            Add Comment
          </Button>
        </div>

        <p className="text-gray-500 text-xs italic">
          Remove this panel before production
        </p>
      </CardContent>
    </Card>
  );
}
