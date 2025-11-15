import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, Smile, Calendar, MapPin } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";

interface ComposeTweetProps {
  onPost: (content: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function ComposeTweet({
  onPost,
  placeholder = "What is happening?!",
  autoFocus = false,
}: ComposeTweetProps) {
  const currentAccount = useCurrentAccount();
  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const maxChars = 280;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    setCharCount(text.length);
  };

  const handlePost = () => {
    if (content.trim() && content.length <= maxChars) {
      onPost(content);
      setContent("");
      setCharCount(0);
    }
  };

  const progress = (charCount / maxChars) * 100;
  const progressColor =
    charCount > maxChars
      ? "text-red-500"
      : charCount > maxChars * 0.9
        ? "text-yellow-500"
        : "text-blue-500";

  return (
    <div className="border-b border-gray-800 p-4">
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
            className="min-h-[120px] text-xl bg-transparent border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
          />

          {/* Media Options */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:bg-blue-500/10 rounded-full p-2"
              >
                <Image className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:bg-blue-500/10 rounded-full p-2"
              >
                <Smile className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:bg-blue-500/10 rounded-full p-2"
              >
                <Calendar className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:bg-blue-500/10 rounded-full p-2"
              >
                <MapPin className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {charCount > 0 && (
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
                  {charCount > maxChars * 0.9 && (
                    <span className={`text-sm ${progressColor}`}>
                      {maxChars - charCount}
                    </span>
                  )}
                </div>
              )}

              <Button
                onClick={handlePost}
                disabled={!content.trim() || charCount > maxChars}
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
