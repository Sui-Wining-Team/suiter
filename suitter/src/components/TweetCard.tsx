import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Repeat2,
  Heart,
  Share,
  MoreHorizontal,
  Trash2,
  BarChart3,
  Bookmark,
  BadgeCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MediaDisplay } from "./MediaDisplay";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TweetCardProps {
  author: string;
  authorAddress: string;
  content: string;
  mediaBlobIds?: string[];
  timestamp: string;
  likes: number;
  isLiked: boolean;
  commentCount?: number;
  reshareCount?: number;
  isOwner?: boolean;
  deleted?: boolean;
  verified?: boolean;
  onClick?: () => void;
  mediaUrls?: string[];
  onLike?: () => void;
  onDelete?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onProfileClick?: () => void;
}

export function TweetCard({
  author,
  authorAddress,
  content,
  mediaBlobIds = [],
  timestamp,
  likes,
  isLiked,
  commentCount = 0,
  reshareCount = 0,
  isOwner = false,
  deleted = false,
  verified = false,
  onClick,
  mediaUrls = [],
  onLike,
  onDelete,
  onComment,
  onShare,
  onProfileClick,
}: TweetCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localLikes, setLocalLikes] = useState(likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalLiked(!localLiked);
    setLocalLikes(localLiked ? localLikes - 1 : localLikes + 1);
    onLike?.();
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  if (deleted) {
    return (
      <div className="border-b border-gray-800 p-4">
        <div className="bg-gray-900 rounded-lg p-4 text-center text-gray-500">
          This suit has been deleted
        </div>
      </div>
    );
  }

  return (
    <article
      className="border-b border-gray-800 hover:bg-gray-900/30 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar
              className="h-12 w-12 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onProfileClick?.();
              }}
            >
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${authorAddress}`}
              />
              <AvatarFallback className="bg-blue-600">
                {author[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1 min-w-0">
                <span
                  className="font-bold hover:underline truncate cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onProfileClick?.();
                  }}
                >
                  {author}
                </span>
                {verified && (
                  <BadgeCheck className="h-5 w-5 text-blue-500 flex-shrink-0" />
                )}
                <span className="text-gray-500 text-sm truncate">
                  @{authorAddress.slice(0, 8)}
                </span>
                <span className="text-gray-500 text-sm">·</span>
                <span className="text-gray-500 text-sm flex-shrink-0 hover:underline cursor-pointer">
                  {timestamp}
                </span>
              </div>

              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full hover:bg-blue-500/10 hover:text-blue-500 flex-shrink-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-black border-gray-800"
                  >
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.();
                      }}
                      className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Suit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Content */}
            <div className="mt-1">
              <p className="text-white whitespace-pre-wrap break-words text-[15px] leading-normal">
                {content}
              </p>
            </div>

            {/* Media */}
            {mediaBlobIds && mediaBlobIds.length > 0 && (
              <MediaDisplay blobIds={mediaBlobIds} />
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-3 max-w-md -ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onComment?.();
                }}
                className="group flex items-center gap-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full px-3 h-9 transition-all duration-200"
              >
                <MessageCircle className="h-[18px] w-[18px] group-hover:scale-110 transition-transform duration-200" />
                {commentCount > 0 && (
                  <span className="text-sm font-medium">{commentCount}</span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare?.();
                }}
                className="group flex items-center gap-2 text-gray-500 hover:text-green-500 hover:bg-green-500/10 rounded-full px-3 h-9 transition-all duration-200"
              >
                <Repeat2 className="h-[18px] w-[18px] group-hover:scale-110 group-hover:rotate-90 transition-all duration-200" />
                {reshareCount > 0 && (
                  <span className="text-sm font-medium">{reshareCount}</span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  "group flex items-center gap-2 rounded-full px-3 h-9 transition-all duration-200",
                  localLiked
                    ? "text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    : "text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                )}
              >
                <Heart
                  className={cn(
                    "h-[18px] w-[18px] transition-all duration-200",
                    localLiked ? "fill-red-500 scale-110" : "group-hover:scale-110"
                  )}
                />
                <span className="text-sm font-medium">{localLikes}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }}
                className="group flex items-center gap-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full px-3 h-9 transition-all duration-200"
              >
                <Share className="h-[18px] w-[18px] group-hover:scale-110 transition-transform duration-200" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={cn(
                  "group flex items-center gap-2 rounded-full px-3 h-9 transition-all duration-200",
                  isBookmarked
                    ? "text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                    : "text-gray-500 hover:text-blue-500 hover:bg-blue-500/10"
                )}
              >
                <Bookmark
                  className={cn(
                    "h-[18px] w-[18px] transition-all duration-200",
                    isBookmarked ? "fill-blue-500" : "group-hover:scale-110"
                  )}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
