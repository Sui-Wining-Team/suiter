import { Card } from "@/components/ui/card";
import { TrendingUp, Users, MessageCircle, Heart, Repeat2 } from "lucide-react";

interface StatsPanelProps {
  totalPosts?: number;
  totalLikes?: number;
  totalComments?: number;
  totalReshares?: number;
  followers?: number;
  following?: number;
}

export function StatsPanel({
  totalPosts = 0,
  totalLikes = 0,
  totalComments = 0,
  totalReshares = 0,
  followers = 0,
  following = 0,
}: StatsPanelProps) {
  const stats = [
    {
      label: "Posts",
      value: totalPosts,
      icon: MessageCircle,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Likes",
      value: totalLikes,
      icon: Heart,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      label: "Reshares",
      value: totalReshares,
      icon: Repeat2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Comments",
      value: totalComments,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Engagement Stats */}
      <Card className="bg-gray-900 border-gray-800 p-4">
        <h3 className="text-white font-bold text-lg mb-4">
          Your Activity
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`${stat.bgColor} rounded-xl p-3 transition-transform hover:scale-105`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-gray-400">{stat.label}</span>
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Network Stats */}
      <Card className="bg-gray-900 border-gray-800 p-4">
        <h3 className="text-white font-bold text-lg mb-4">
          Network
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-xl hover:bg-blue-500/20 transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-gray-400">Followers</span>
            </div>
            <span className="text-xl font-bold text-blue-500">
              {followers.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl hover:bg-green-500/20 transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <span className="text-gray-400">Following</span>
            </div>
            <span className="text-xl font-bold text-green-500">
              {following.toLocaleString()}
            </span>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gray-900 border-gray-800 p-4">
        <h3 className="text-white font-bold text-lg mb-3">
          Quick Stats
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Engagement Rate</span>
            <span className="text-white font-medium">
              {totalPosts > 0
                ? ((totalLikes + totalComments) / totalPosts).toFixed(1)
                : "0"}
              %
            </span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Avg. Likes/Post</span>
            <span className="text-white font-medium">
              {totalPosts > 0 ? (totalLikes / totalPosts).toFixed(1) : "0"}
            </span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Avg. Comments/Post</span>
            <span className="text-white font-medium">
              {totalPosts > 0 ? (totalComments / totalPosts).toFixed(1) : "0"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
