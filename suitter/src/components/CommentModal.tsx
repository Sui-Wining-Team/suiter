import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { X } from "lucide-react";
import { MediaUploader } from "./MediaUploader";
import { toast } from "sonner";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComment: (content: string, mediaBlobIds: string[]) => void;
  postAuthor: string;
  postContent: string;
  postTimestamp: string;
}

export function CommentModal({
  isOpen,
  onClose,
  onComment,
  postAuthor,
  postContent,
  postTimestamp,
}: CommentModalProps) {
  const currentAccount = useCurrentAccount();
  const [comment, setComment] = useState("");
  const [mediaBlobIds, setMediaBlobIds] = useState<string[]>([]);
  const maxChars = 280;

  const handleSubmit = () => {
    if (!currentAccount) {
      toast.error("Please connect your wallet to comment");
      return;
    }

    if (comment.trim() && comment.length <= maxChars) {
      onComment(comment, mediaBlobIds);
      setComment("");
      setMediaBlobIds([]);
      onClose();
    }
  };

  const progress = (comment.length / maxChars) * 100;
  const progressColor =
    comment.length > maxChars
      ? "text-red-500"
      : comment.length > maxChars * 0.9
        ? "text-yellow-500"
        : "text-blue-500";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="sr-only">Reply</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full h-8 w-8 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Original Post */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${postAuthor}`}
                />
                <AvatarFallback>{postAuthor[0]}</AvatarFallback>
              </Avatar>
              <div className="w-0.5 bg-gray-700 flex-1 my-1" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold">{postAuthor}</span>
                <span className="text-gray-500 text-sm">· {postTimestamp}</span>
              </div>
              <p className="text-gray-300 mt-1">{postContent}</p>
              <p className="text-gray-500 text-sm mt-2">
                Replying to <span className="text-blue-500">@{postAuthor}</span>
              </p>
            </div>
          </div>

          {/* Reply Input */}
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage
                src={
                  currentAccount
                    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentAccount.address}`
                    : undefined
                }
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Post your reply"
                disabled={!currentAccount}
                className="min-h-[100px] text-xl bg-transparent border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
              />

              {/* Media Uploader */}
              <MediaUploader
                onMediaChange={setMediaBlobIds}
                maxFiles={4}
                disabled={!currentAccount}
              />

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                <div className="text-sm text-gray-500">
                  {mediaBlobIds.length > 0 && (
                    <span>{mediaBlobIds.length} media file(s) attached</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {comment.length > 0 && (
                    <div className="flex items-center gap-2">
                      <svg className="w-8 h-8 transform -rotate-90">
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          className="text-gray-700"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 14}`}
                          strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress / 100)}`}
                          className={progressColor}
                        />
                      </svg>
                      {comment.length > maxChars * 0.9 && (
                        <span className={`text-sm ${progressColor}`}>
                          {maxChars - comment.length}
                        </span>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={handleSubmit}
                    disabled={!comment.trim() || comment.length > maxChars}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full px-6 disabled:opacity-50"
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
