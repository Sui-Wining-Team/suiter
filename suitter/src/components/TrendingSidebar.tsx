import { Search, TrendingUp, Sparkles, Calendar, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const trendingTopics = [
  { topic: "#SuiBlockchain", posts: "12.5K", change: "+45%" },
  { topic: "#Web3", posts: "8.2K", change: "+32%" },
  { topic: "#Suitter", posts: "5.1K", change: "+78%" },
  { topic: "#NFTs", posts: "3.7K", change: "+12%" },
  { topic: "#DeFi", posts: "2.9K", change: "+28%" },
];

const whoToFollow = [
  {
    name: "Sui Foundation",
    handle: "SuiFoundation",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sui",
  },
  {
    name: "Move Language",
    handle: "MoveLang",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=move",
  },
  {
    name: "Web3 Dev",
    handle: "Web3Builder",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=web3",
  },
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
            Subscribe to unlock new features and if eligible, receive a share of
            revenue.
          </p>
          <Button className="bg-blue-500 hover:bg-blue-600 rounded-full font-bold">
            Subscribe
          </Button>
        </CardContent>
      </Card>

      {/* What's Happening */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            What's Happening
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-0">
          <div className="px-4 py-3 hover:bg-gray-800 transition-colors cursor-pointer border-b border-gray-800">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-500">Today • Trending</span>
            </div>
            <p className="font-bold">Sui Developer Summit 2024</p>
            <p className="text-sm text-gray-500">5.2K Suits</p>
          </div>
          <div className="px-4 py-3 hover:bg-gray-800 transition-colors cursor-pointer border-b border-gray-800">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-gray-500">Live • Technology</span>
            </div>
            <p className="font-bold">New Move Language Update</p>
            <p className="text-sm text-gray-500">3.8K Suits</p>
          </div>
        </CardContent>
      </Card>

      {/* Trending */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Trends for you
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {trendingTopics.map((trend, index) => (
            <button
              key={index}
              className="w-full px-4 py-3 hover:bg-gray-800 transition-colors text-left border-b border-gray-800 last:border-0 group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-gray-500">Trending in Web3</p>
                    <Badge variant="outline" className="text-xs border-green-500 text-green-500">
                      {trend.change}
                    </Badge>
                  </div>
                  <p className="font-bold text-white group-hover:text-blue-500 transition-colors">
                    {trend.topic}
                  </p>
                  <p className="text-sm text-gray-500">{trend.posts} posts</p>
                </div>
              </div>
            </button>
          ))}
          <button className="w-full px-4 py-3 text-blue-500 hover:bg-gray-800 transition-colors text-left font-medium">
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
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-0"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate hover:underline cursor-pointer">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    @{user.handle}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-white text-black hover:bg-gray-200 font-bold rounded-full px-4 flex-shrink-0"
              >
                Follow
              </Button>
            </div>
          ))}
          <button className="w-full px-4 py-3 text-blue-500 hover:bg-gray-800 transition-colors text-left font-medium">
            Show more
          </button>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="px-4 py-2">
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          <a href="#" className="hover:underline">Terms of Service</a>
          <span>·</span>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <span>·</span>
          <a href="#" className="hover:underline">Cookie Policy</a>
          <span>·</span>
          <a href="#" className="hover:underline">Accessibility</a>
          <span>·</span>
          <a href="#" className="hover:underline">Ads info</a>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          © 2024 Suitter on Sui
        </p>
      </div>
    </div>
  );
}
