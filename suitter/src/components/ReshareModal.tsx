import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Repeat2 } from "lucide-react";
import { TweetCard } from "./TweetCard";

interface ReshareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReshare: (comment?: string) => void;
  originalPost: {
    author: string;
    authorAddress: string;
    content: string;
    timestamp: string;
    likes: number;
    commentCount: number;
    isLiked: boolean;
  };
}

export function ReshareModal({
  isOpen,
  onClose,
  onReshare,
  originalPost,
}: ReshareModalProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReshare = async (withComment: boolean) => {
    setIsSubmitting(true);
    try {
      await onReshare(withComment ? comment : undefined);
      setComment("");
      onClose();
    } catch (error) {
      console.error("Reshare failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-gray-800 max-w-xl p-0">
        <DialogHeader className="p-4 border-b border-gray-800">
          <DialogTitle className="text-white text-xl">
            Reshare Suit
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* Quick Reshare Button */}
          <Button
            onClick={() => handleReshare(false)}
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-6 font-bold text-lg"
          >
            <Repeat2 className="h-5 w-5 mr-2" />
            {isSubmitting ? "Resharing..." : "Reshare"}
          </Button>

          {/* Reshare with Comment */}
          <div className="border-t border-gray-800 pt-4">
            <p className="text-gray-400 text-sm mb-2">Add a comment (optional)</p>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your thoughts..."
              className="bg-transparent border-gray-700 text-white placeholder:text-gray-500 resize-none min-h-[80px] mb-3"
              maxLength={280}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {comment.length}/280
              </span>
              <Button
                onClick={() => handleReshare(true)}
                disabled={isSubmitting || comment.trim().length === 0}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 font-bold"
              >
                <Repeat2 className="h-4 w-4 mr-2" />
                {isSubmitting ? "Resharing..." : "Reshare with comment"}
              </Button>
            </div>
          </div>

          {/* Original Post Preview */}
          <div className="border border-gray-700 rounded-2xl overflow-hidden">
            <TweetCard
              author={originalPost.author}
              authorAddress={originalPost.authorAddress}
              content={originalPost.content}
              timestamp={originalPost.timestamp}
              likes={originalPost.likes}
              isLiked={originalPost.isLiked}
              commentCount={originalPost.commentCount}
              isOwner={false}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
