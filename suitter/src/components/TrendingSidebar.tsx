import { Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const trendingTopics = [
  { topic: "#SuiBlockchain", posts: "12.5K" },
  { topic: "#Web3", posts: "8.2K" },
  { topic: "#Suitter", posts: "5.1K" },
  { topic: "#NFTs", posts: "3.7K" },
  { topic: "#DeFi", posts: "2.9K" },
];

const whoToFollow = [
  { name: "Sui Foundation", handle: "SuiFoundation", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sui" },
  { name: "Move Language", handle: "MoveLang", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=move" },
  { name: "Web3 Dev", handle: "Web3Builder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=web3" },
];

export function TrendingSidebar() {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="sticky top-0 bg-black py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            type="search"
            placeholder="Search"
            className="bg-gray-900 border-0 pl-12 rounded-full focus-visible:ring-1 focus-visible:ring-blue-500"
          />
        </div>
      </div>

      {/* Subscribe Banner */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl">Subscribe to Premium</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 mb-3">
            Subscribe to unlock new features and if eligible, receive a share of revenue.
          </p>
          <Button className="bg-blue-500 hover:bg-blue-600 rounded-full font-bold">
            Subscribe
          </Button>
        </CardContent>
      </Card>

      {/* Trending */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trends for you
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {trendingTopics.map((trend, index) => (
            <button
              key={index}
              className="w-full px-4 py-3 hover:bg-gray-800 transition-colors text-left"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Trending</p>
                  <p className="font-bold">{trend.topic}</p>
                  <p className="text-sm text-gray-500">{trend.posts} posts</p>
                </div>
              </div>
            </button>
          ))}
          <button className="w-full px-4 py-3 text-blue-500 hover:bg-gray-800 transition-colors text-left">
            Show more
          </button>
        </CardContent>
      </Card>

      {/* Who to Follow */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl">Who to follow</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {whoToFollow.map((user, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-gray-800 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm text-gray-500">@{user.handle}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full bg-white text-black hover:bg-gray-200 font-bold"
              >
                Follow
              </Button>
            </div>
          ))}
          <button className="w-full px-4 py-3 text-blue-500 hover:bg-gray-800 transition-colors text-left">
            Show more
          </button>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="px-4 py-3 text-xs text-gray-500 space-y-2">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">Terms of Service</a>
          <span>·</span>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <span>·</span>
          <a href="#" className="hover:underline">Cookie Policy</a>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">Accessibility</a>
          <span>·</span>
          <a href="#" className="hover:underline">Ads info</a>
          <span>·</span>
          <a href="#" className="hover:underline">More</a>
        </div>
        <p>© 2025 Suitter, Inc.</p>
      </div>
    </div>
  );
}
