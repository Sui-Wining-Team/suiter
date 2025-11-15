import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useProfile, usePost } from "@/hooks/useSuitterContract";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TweetCard } from "./TweetCard";
import { ProfileEditModal } from "./ProfileEditModal";
import { Loader2, ArrowLeft, Calendar } from "lucide-react";
import { toast } from "sonner";

interface UserProfileProps {
  address?: string;
  onBack?: () => void;
}

export function UserProfile({ address, onBack }: UserProfileProps) {
  const currentAccount = useCurrentAccount();
  const { getProfile, createProfile, updateProfile } = useProfile();
  const { getUserPosts } = usePost();

  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "replies" | "media">(
    "posts",
  );
  const [editModalOpen, setEditModalOpen] = useState(false);

  const profileAddress = address || currentAccount?.address;
  const isOwnProfile = profileAddress === currentAccount?.address;

  useEffect(() => {
    const fetchData = async () => {
      if (!profileAddress) return;

      setLoading(true);
      try {
        const [profileData, postsData] = await Promise.all([
          getProfile(profileAddress),
          getUserPosts(profileAddress),
        ]);

        setProfile(profileData);
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profileAddress]);

  const handleSaveProfile = async (
    username: string,
    bio: string,
    avatar: string,
  ) => {
    try {
      toast.loading("Saving profile...", { id: "save-profile" });

      if (profile) {
        // Update existing profile
        await updateProfile(profile.id, username, bio, avatar);
      } else {
        // Create new profile
        await createProfile(username, bio, avatar);
      }

      toast.success("Profile saved!", { id: "save-profile" });
      setEditModalOpen(false);

      // Refresh profile data
      setTimeout(async () => {
        const updatedProfile = await getProfile(profileAddress);
        setProfile(updatedProfile);
      }, 2000);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.", {
        id: "save-profile",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const displayName =
    profile?.username ||
    profileAddress?.slice(0, 6) + "..." + profileAddress?.slice(-4) ||
    "Unknown";
  const bio = profile?.bio_cid || "No bio yet";

  return (
    <div className="w-full">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-black/80 border-b border-gray-800">
        <div className="flex items-center gap-8 px-4 py-3">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-full h-8 w-8 p-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-xl font-bold">{displayName}</h1>
            <p className="text-sm text-gray-500">{posts.length} posts</p>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="border-b border-gray-800">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600" />

        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex justify-between items-start -mt-16 mb-4">
            <Avatar className="h-32 w-32 border-4 border-black">
              <AvatarImage
                src={
                  profile?.avatar_cid ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileAddress}`
                }
              />
              <AvatarFallback className="text-4xl">
                {displayName[0]}
              </AvatarFallback>
            </Avatar>

            {isOwnProfile ? (
              <Button
                variant="outline"
                onClick={() => setEditModalOpen(true)}
                className="mt-3 rounded-full border-gray-600 hover:bg-gray-800"
              >
                Edit profile
              </Button>
            ) : (
              <Button className="mt-3 bg-white text-black hover:bg-gray-200 rounded-full font-bold">
                Follow
              </Button>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold">{displayName}</h2>
            <p className="text-gray-500">@{profileAddress?.slice(0, 8)}</p>
          </div>

          <p className="mt-3 text-white">{bio}</p>

          <div className="flex items-center gap-4 mt-3 text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Joined November 2025</span>
            </div>
          </div>

          <div className="flex gap-4 mt-3">
            <button className="hover:underline">
              <span className="font-bold text-white">0</span>{" "}
              <span className="text-gray-500">Following</span>
            </button>
            <button className="hover:underline">
              <span className="font-bold text-white">0</span>{" "}
              <span className="text-gray-500">Followers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-4 hover:bg-gray-900 transition-colors ${
            activeTab === "posts"
              ? "border-b-4 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab("replies")}
          className={`flex-1 py-4 hover:bg-gray-900 transition-colors ${
            activeTab === "replies"
              ? "border-b-4 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
        >
          Replies
        </button>
        <button
          onClick={() => setActiveTab("media")}
          className={`flex-1 py-4 hover:bg-gray-900 transition-colors ${
            activeTab === "media"
              ? "border-b-4 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
        >
          Media
        </button>
      </div>

      {/* Posts */}
      <div>
        {activeTab === "posts" && (
          <>
            {posts.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg">No posts yet</p>
              </div>
            ) : (
              posts.map((post) => {
                // Simple contract uses text field directly, not metadata_cid
                const content =
                  typeof post.metadata_cid === "string"
                    ? post.metadata_cid
                    : "No content";

                // Use current timestamp if not available
                const timestamp = post.timestamp || Date.now();
                const timeAgo = getTimeAgo(timestamp);

                return (
                  <TweetCard
                    key={post.id}
                    author={displayName}
                    authorAddress={profileAddress || ""}
                    content={content}
                    timestamp={timeAgo}
                    likes={0}
                    isLiked={false}
                    commentCount={0}
                    isOwner={isOwnProfile}
                    deleted={false}
                  />
                );
              })
            )}
          </>
        )}

        {activeTab === "replies" && (
          <div className="p-12 text-center text-gray-500">
            Replies coming soon...
          </div>
        )}

        {activeTab === "media" && (
          <div className="p-12 text-center text-gray-500">
            Media coming soon...
          </div>
        )}
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveProfile}
        currentUsername={profile?.username || ""}
        currentBio={profile?.bio_cid || ""}
        currentAvatar={profile?.avatar_cid || ""}
        currentAddress={profileAddress}
      />
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
