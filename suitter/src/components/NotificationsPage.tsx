import { useState, useEffect } from "react";
import { Bell, Heart, MessageCircle, Repeat2, UserPlus, Sparkles, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentAccount } from "@mysten/dapp-kit";

interface Notification {
  id: string;
  type: "like" | "comment" | "reshare" | "follow" | "welcome" | "system";
  user?: {
    name: string;
    address: string;
    avatar?: string;
  };
  content?: string;
  timestamp: Date;
  read: boolean;
}

export function NotificationsPage() {
  const currentAccount = useCurrentAccount();
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Initialize with welcome and system notifications
    const initialNotifications: Notification[] = [
      {
        id: "1",
        type: "welcome",
        content: "Welcome to Suitter! 🎉 Start exploring and connect with the Sui community.",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false,
      },
      {
        id: "2",
        type: "system",
        content: "Your account is now connected to Sui testnet. You can start posting!",
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        read: false,
      },
      {
        id: "3",
        type: "system",
        content: "💡 Tip: Use hashtags to increase the discoverability of your posts",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
      },
      {
        id: "4",
        type: "like",
        user: {
          name: "Sui Builder",
          address: "0x123...abc",
        },
        content: "liked your post",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: false,
      },
      {
        id: "5",
        type: "follow",
        user: {
          name: "Web3 Developer",
          address: "0x456...def",
        },
        content: "started following you",
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        read: false,
      },
      {
        id: "6",
        type: "system",
        content: "🔥 Trending now: #SuiBlockchain - Join the conversation!",
        timestamp: new Date(Date.now() - 1000 * 60 * 180),
        read: false,
      },
      {
        id: "7",
        type: "comment",
        user: {
          name: "Move Expert",
          address: "0x789...ghi",
        },
        content: "commented on your post: \"Great insights!\"",
        timestamp: new Date(Date.now() - 1000 * 60 * 240),
        read: true,
      },
      {
        id: "8",
        type: "system",
        content: "✨ New feature: Bookmark posts to save them for later",
        timestamp: new Date(Date.now() - 1000 * 60 * 300),
        read: true,
      },
    ];

    setNotifications(initialNotifications);
  }, [currentAccount]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "mentions") return n.type === "comment" || n.type === "reshare";
    return false;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-8 w-8 text-red-500 fill-red-500" />;
      case "comment":
        return <MessageCircle className="h-8 w-8 text-blue-500" />;
      case "reshare":
        return <Repeat2 className="h-8 w-8 text-green-500" />;
      case "follow":
        return <UserPlus className="h-8 w-8 text-blue-500" />;
      case "welcome":
        return <Sparkles className="h-8 w-8 text-yellow-500" />;
      case "system":
        return <Bell className="h-8 w-8 text-blue-500" />;
      default:
        return <Bell className="h-8 w-8 text-gray-500" />;
    }
  };

  const getTimeAgo = (date: Date): string => {
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
        return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-black/80 border-b border-gray-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500">{unreadCount} unread</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="rounded-full hover:bg-gray-900"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b border-gray-800 rounded-none h-auto p-0">
            <TabsTrigger
              value="all"
              className="flex-1 data-[state=active]:border-b-4 data-[state=active]:border-blue-500 rounded-none py-4 data-[state=active]:bg-transparent"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="mentions"
              className="flex-1 data-[state=active]:border-b-4 data-[state=active]:border-blue-500 rounded-none py-4 data-[state=active]:bg-transparent"
            >
              Mentions
            </TabsTrigger>
          </TabsList>

          {/* All Notifications */}
          <TabsContent value="all" className="mt-0">
            <div className="divide-y divide-gray-800">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-8">
                  <div className="text-center space-y-4">
                    <Bell className="h-16 w-16 text-gray-600 mx-auto" />
                    <h3 className="text-2xl font-bold text-white">No notifications yet</h3>
                    <p className="text-gray-400">
                      When you get notifications, they'll show up here.
                    </p>
                  </div>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-4 hover:bg-gray-900/50 transition-colors cursor-pointer border-l-4 ${
                      notification.read ? "border-transparent" : "border-blue-500"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 pt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {notification.user && (
                          <div className="flex items-start gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.user.address}`}
                              />
                              <AvatarFallback>
                                {notification.user.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold truncate">
                                {notification.user.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                @{notification.user.address}
                              </p>
                            </div>
                          </div>
                        )}

                        <p className={`${notification.read ? "text-gray-400" : "text-white"}`}>
                          {notification.content}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {getTimeAgo(notification.timestamp)}
                        </p>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Mentions */}
          <TabsContent value="mentions" className="mt-0">
            <div className="divide-y divide-gray-800">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-8">
                  <div className="text-center space-y-4">
                    <MessageCircle className="h-16 w-16 text-gray-600 mx-auto" />
                    <h3 className="text-2xl font-bold text-white">No mentions yet</h3>
                    <p className="text-gray-400">
                      When someone mentions you, you'll find it here.
                    </p>
                  </div>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-4 hover:bg-gray-900/50 transition-colors cursor-pointer border-l-4 ${
                      notification.read ? "border-transparent" : "border-blue-500"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 pt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        {notification.user && (
                          <div className="flex items-start gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.user.address}`}
                              />
                              <AvatarFallback>
                                {notification.user.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold truncate">
                                {notification.user.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                @{notification.user.address}
                              </p>
                            </div>
                          </div>
                        )}
                        <p className={`${notification.read ? "text-gray-400" : "text-white"}`}>
                          {notification.content}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {getTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
