import { useState } from "react";
import { Search, TrendingUp, Sparkles, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TweetCard } from "./TweetCard";
import { TweetSkeletonList } from "./TweetSkeleton";
import { useReadSuits } from "@/hooks/useReadSuits";
import { useLike } from "@/hooks/useSuitterContract";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { toast } from "sonner";

const trendingTopics = [
  { topic: "#SuiBlockchain", posts: "12.5K", description: "Technology • Trending" },
  { topic: "#Web3", posts: "8.2K", description: "Crypto • Trending" },
  { topic: "#Suitter", posts: "5.1K", description: "Social • Trending" },
  { topic: "#NFTs", posts: "3.7K", description: "Art • Trending" },
  { topic: "#DeFi", posts: "2.9K", description: "Finance • Trending" },
  { topic: "#Move", posts: "2.1K", description: "Programming • Trending" },
];

export function ExplorePage() {
  const currentAccount = useCurrentAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("trending");
  
  const { data: suits, isLoading, error } = useReadSuits();
  const { likePost, unlikePost } = useLike();

  // Filter posts based on search query
  const filteredSuits = suits?.filter((suit: any) => {
    if (!searchQuery.trim()) return true;
    const text = (suit as any).text || "";
    const owner = (suit as any).owner || "";
    return (
      text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleLikeToggle = async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await unlikePost(postId);
        toast.success("Unliked post");
      } else {
        await likePost(postId);
        toast.success("Liked post");
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast.error("Failed to update like");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-black/80 border-b border-gray-800">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Explore</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="search"
              placeholder="Search Suitter"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-900 border-0 pl-12 rounded-full focus-visible:ring-1 focus-visible:ring-blue-500 text-lg py-6"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b border-gray-800 rounded-none h-auto p-0">
            <TabsTrigger
              value="trending"
              className="flex-1 data-[state=active]:border-b-4 data-[state=active]:border-blue-500 rounded-none py-4 data-[state=active]:bg-transparent"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger
              value="latest"
              className="flex-1 data-[state=active]:border-b-4 data-[state=active]:border-blue-500 rounded-none py-4 data-[state=active]:bg-transparent"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Latest
            </TabsTrigger>
            <TabsTrigger
              value="topics"
              className="flex-1 data-[state=active]:border-b-4 data-[state=active]:border-blue-500 rounded-none py-4 data-[state=active]:bg-transparent"
            >
              <Hash className="h-4 w-4 mr-2" />
              Topics
            </TabsTrigger>
          </TabsList>

          {/* Trending Posts */}
          <TabsContent value="trending" className="mt-0">
            {isLoading && <TweetSkeletonList count={5} />}
            
            {error && (
              <div className="p-8 text-center text-red-500">
                Failed to load posts
              </div>
            )}

            {!isLoading && filteredSuits && filteredSuits.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 px-8">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🔍</div>
                  <h3 className="text-2xl font-bold text-white">
                    {searchQuery ? "No results found" : "No posts yet"}
                  </h3>
                  <p className="text-gray-400">
                    {searchQuery
                      ? `Try searching for something else`
                      : "Be the first to post on Suitter!"}
                  </p>
                </div>
              </div>
            )}

            <div className="divide-y divide-gray-800">
              {filteredSuits?.map((suit: any, index: number) => {
                const postId = suit.id?.id || suit.id;
                const author = suit.owner || "Unknown";
                const content = suit.text || "";
                const timestamp = suit.timestamp || Date.now().toString();
                const likes = Array.isArray(suit.likes?.contents)
                  ? suit.likes.contents.length
                  : 0;
                const isLiked = currentAccount
                  ? suit.likes?.contents?.includes(currentAccount.address)
                  : false;

                const date = new Date(parseInt(timestamp));
                const timeAgo = getTimeAgo(date);

                return (
                  <div
                    key={postId}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                  >
                    <TweetCard
                      author={author}
                      authorAddress={author}
                      content={content}
                      mediaBlobIds={suit.media_blob_ids || []}
                      timestamp={timeAgo}
                      likes={likes}
                      isLiked={isLiked}
                      commentCount={0}
                      reshareCount={0}
                      verified={index % 5 === 0}
                      onLike={() => handleLikeToggle(postId, isLiked)}
                      onClick={() => console.log("Post clicked:", postId)}
                      onProfileClick={() => console.log("Profile:", author)}
                    />
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Latest Posts */}
          <TabsContent value="latest" className="mt-0">
            {isLoading && <TweetSkeletonList count={5} />}
            
            <div className="divide-y divide-gray-800">
              {filteredSuits?.slice().reverse().map((suit: any, index: number) => {
                const postId = suit.id?.id || suit.id;
                const author = suit.owner || "Unknown";
                const content = suit.text || "";
                const timestamp = suit.timestamp || Date.now().toString();
                const likes = Array.isArray(suit.likes?.contents)
                  ? suit.likes.contents.length
                  : 0;
                const isLiked = currentAccount
                  ? suit.likes?.contents?.includes(currentAccount.address)
                  : false;

                const date = new Date(parseInt(timestamp));
                const timeAgo = getTimeAgo(date);

                return (
                  <div key={postId}>
                    <TweetCard
                      author={author}
                      authorAddress={author}
                      content={content}
                      mediaBlobIds={suit.media_blob_ids || []}
                      timestamp={timeAgo}
                      likes={likes}
                      isLiked={isLiked}
                      commentCount={0}
                      reshareCount={0}
                      onLike={() => handleLikeToggle(postId, isLiked)}
                      onClick={() => console.log("Post clicked:", postId)}
                      onProfileClick={() => console.log("Profile:", author)}
                    />
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Topics */}
          <TabsContent value="topics" className="mt-0">
            <div className="divide-y divide-gray-800">
              {trendingTopics.map((topic, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-4 hover:bg-gray-900/50 transition-colors text-left group"
                  onClick={() => {
                    setSearchQuery(topic.topic);
                    setActiveTab("trending");
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">{topic.description}</p>
                      <p className="font-bold text-lg group-hover:text-blue-500 transition-colors">
                        {topic.topic}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{topic.posts} posts</p>
                    </div>
                    <Hash className="h-5 w-5 text-gray-600 flex-shrink-0 ml-4" />
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval}${unit[0]}`;
    }
  }

  return "now";
}
