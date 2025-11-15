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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TweetCardProps {
  author: string;
  authorAddress: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  commentCount?: number;
  isOwner?: boolean;
  deleted?: boolean;
  onLike?: () => void;
  onDelete?: () => void;
  onComment?: () => void;
}

export function TweetCard({
  author,
  authorAddress,
  content,
  timestamp,
  likes,
  isLiked,
  commentCount = 0,
  isOwner = false,
  deleted = false,
  onLike,
  onDelete,
  onComment,
}: TweetCardProps) {
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localLikes, setLocalLikes] = useState(likes);

  const handleLike = () => {
    setLocalLiked(!localLiked);
    setLocalLikes(localLiked ? localLikes - 1 : localLikes + 1);
    onLike?.();
  };

  if (deleted) {
    return (
      <div className="border-b border-gray-800 p-4">
        <div className="bg-gray-900 rounded-lg p-4 text-center text-gray-500">
          This post has been deleted
        </div>
      </div>
    );
  }

  return (
    <article className="border-b border-gray-800 p-4 hover:bg-gray-900/30 transition-colors cursor-pointer">
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${authorAddress}`}
          />
          <AvatarFallback>{author[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-bold hover:underline truncate">
                {author}
              </span>
              <span className="text-gray-500 text-sm truncate">
                @{authorAddress.slice(0, 8)}
              </span>
              <span className="text-gray-500 text-sm">·</span>
              <span className="text-gray-500 text-sm flex-shrink-0">
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
                    onClick={onDelete}
                    className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Content */}
          <div className="mt-1">
            <p className="text-white whitespace-pre-wrap break-words">
              {content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 max-w-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onComment?.();
              }}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full px-3"
            >
              <MessageCircle className="h-4 w-4" />
              {commentCount > 0 && (
                <span className="text-sm">{commentCount}</span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-500 hover:text-green-500 hover:bg-green-500/10 rounded-full px-3"
            >
              <Repeat2 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className={`flex items-center gap-2 rounded-full px-3 ${
                localLiked
                  ? "text-pink-500 hover:text-pink-600 hover:bg-pink-500/10"
                  : "text-gray-500 hover:text-pink-500 hover:bg-pink-500/10"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${localLiked ? "fill-current" : ""}`}
              />
              {localLikes > 0 && <span className="text-sm">{localLikes}</span>}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full px-3"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
