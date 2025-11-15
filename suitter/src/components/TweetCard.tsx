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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MediaDisplay } from "./MediaDisplay";
import { toast } from "sonner";

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
  onClick,
  mediaUrls = [],
  onLike,
  onDelete,
  onComment,
  onShare,
  onProfileClick,
}: TweetCardProps) {
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localLikes, setLocalLikes] = useState(likes);
  const [showStats, setShowStats] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalLiked(!localLiked);
    setLocalLikes(localLiked ? localLikes - 1 : localLikes + 1);
    onLike?.();
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
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="font-bold hover:underline truncate cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onProfileClick?.();
                  }}
                >
                  {author}
                </span>
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
            {mediaUrls.length > 0 && (
              <div
                className={`mt-3 rounded-2xl overflow-hidden border border-gray-700 ${
                  mediaUrls.length === 1
                    ? "max-h-[500px]"
                    : mediaUrls.length === 2
                      ? "grid grid-cols-2 gap-0.5"
                      : mediaUrls.length === 3
                        ? "grid grid-cols-2 gap-0.5"
                        : "grid grid-cols-2 gap-0.5"
                }`}
              >
                {mediaUrls.slice(0, 4).map((url, i) => (
                  <div
                    key={i}
                    className={`relative ${
                      mediaUrls.length === 3 && i === 0 ? "row-span-2" : ""
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Media ${i + 1}`}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="mt-1">
              <p className="text-white whitespace-pre-wrap break-words text-[15px] leading-normal">
                {content}
              </p>
            </div>

            {/* Stats Preview */}
            {(localLikes > 0 || commentCount > 0 || reshareCount > 0) && (
              <div
                className="flex items-center gap-3 mt-3 text-sm text-gray-500 cursor-pointer hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStats(!showStats);
                }}
              >
                {reshareCount > 0 && (
                  <span>
                    <span className="font-semibold text-white">
                      {reshareCount}
                    </span>{" "}
                    Reshares
                  </span>
                )}
                {commentCount > 0 && (
                  <span>
                    <span className="font-semibold text-white">
                      {commentCount}
                    </span>{" "}
                    Comments
                  </span>
                )}
                {localLikes > 0 && (
                  <span>
                    <span className="font-semibold text-white">
                      {localLikes}
                    </span>{" "}
                    Likes
                  </span>
                )}
              </div>
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
                className="group flex items-center gap-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full px-3 h-9"
              >
                <MessageCircle className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" />
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
                className="group flex items-center gap-2 text-gray-500 hover:text-green-500 hover:bg-green-500/10 rounded-full px-3 h-9"
              >
                <Repeat2 className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" />
                {reshareCount > 0 && (
                  <span className="text-sm font-medium">{reshareCount}</span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`group flex items-center gap-2 rounded-full px-3 h-9 transition-all ${
                  localLiked
                    ? "text-pink-500 hover:text-pink-600 hover:bg-pink-500/10"
                    : "text-gray-500 hover:text-pink-500 hover:bg-pink-500/10"
                }`}
              >
                <Heart
                  className={`h-[18px] w-[18px] group-hover:scale-110 transition-transform ${
                    localLiked ? "fill-current" : ""
                  }`}
                />
                {localLikes > 0 && (
                  <span className="text-sm font-medium">{localLikes}</span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStats(!showStats);
                }}
                className="group flex items-center gap-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full px-3 h-9"
              >
                <BarChart3 className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard!');
                }}
                className="group flex items-center gap-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full px-3 h-9"
              >
                <Share className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
