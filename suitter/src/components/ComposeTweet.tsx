import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { MediaUpload } from "./MediaUpload";
import { toast } from "sonner";

interface ComposeTweetProps {
  onPost: (content: string, mediaBlobIds: string[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function ComposeTweet({
  onPost,
  placeholder = "What is happening?!",
  autoFocus = false,
  disabled = false,
}: ComposeTweetProps) {
  const currentAccount = useCurrentAccount();
  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [mediaBlobIds, setMediaBlobIds] = useState<string[]>([]);
  const maxChars = 280;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    setCharCount(text.length);
  };

  const handleMediaChange = (files: File[]) => {
    // TODO: Upload files to Walrus and get blob IDs
    // For now, just store empty array until Walrus integration
    setMediaBlobIds([]);
  };

  const handlePost = () => {
    if (!currentAccount) {
      toast.error("Please connect your wallet to post");
      return;
    }

    if (content.trim() && content.length <= maxChars) {
      onPost(content, mediaBlobIds);
      setContent("");
      setCharCount(0);
      setMediaBlobIds([]);
    }
  };

  const progress = (charCount / maxChars) * 100;
  const progressColor =
    charCount > maxChars
      ? "text-red-500"
      : charCount > maxChars * 0.9
        ? "text-yellow-500"
        : "text-blue-500";
  
  const strokeColor =
    charCount > maxChars
      ? "stroke-red-500"
      : charCount > maxChars * 0.9
        ? "stroke-yellow-500"
        : "stroke-blue-500";

  const isPostDisabled =
    !currentAccount || disabled || !content.trim() || charCount > maxChars;

  return (
    <div className="border-b border-gray-800 p-4">
      {!currentAccount && (
        <div className="mb-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-400">
            Connect your wallet to create posts
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Avatar className="h-12 w-12 flex-shrink-0">
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
            value={content}
            onChange={handleContentChange}
            placeholder={placeholder}
            autoFocus={autoFocus}
            disabled={!currentAccount || disabled}
            className="min-h-[120px] text-xl bg-transparent border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
          />

          {/* Media Upload */}
          <div className="mt-3">
            <MediaUpload onMediaChange={handleMediaChange} maxFiles={4} />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
            <div className="text-sm text-gray-500">
              {mediaBlobIds.length > 0 && (
                <span>{mediaBlobIds.length} media file(s) attached</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {charCount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="16"
                        cy="16"
                        r="12"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className="text-gray-700"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="12"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 12}`}
                        strokeDashoffset={`${2 * Math.PI * 12 * (1 - progress / 100)}`}
                        className={strokeColor}
                        style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                      />
                    </svg>
                  </div>
                  {charCount > maxChars * 0.8 && (
                    <span className={`text-sm font-medium ${progressColor}`}>
                      {charCount > maxChars ? `-${charCount - maxChars}` : maxChars - charCount}
                    </span>
                  )}
                </div>
              )}

              <Button
                onClick={handlePost}
                disabled={isPostDisabled}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full px-6 disabled:opacity-50"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
