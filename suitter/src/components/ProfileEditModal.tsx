import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (username: string, bio: string, avatar: string) => void;
  currentUsername?: string;
  currentBio?: string;
  currentAvatar?: string;
  currentAddress?: string;
}

export function ProfileEditModal({
  isOpen,
  onClose,
  onSave,
  currentUsername = "",
  currentBio = "",
  currentAvatar = "",
  currentAddress = "",
}: ProfileEditModalProps) {
  const [username, setUsername] = useState(currentUsername);
  const [bio, setBio] = useState(currentBio);
  const [avatar, setAvatar] = useState(currentAvatar);

  useEffect(() => {
    setUsername(currentUsername);
    setBio(currentBio);
    setAvatar(currentAvatar);
  }, [currentUsername, currentBio, currentAvatar]);

  const handleSave = () => {
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (username.length > 50) {
      toast.error("Username must be 50 characters or less");
      return;
    }

    if (bio.length > 280) {
      toast.error("Bio must be 280 characters or less");
      return;
    }

    onSave(username, bio, avatar);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="rounded-full h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
              <DialogTitle>Edit profile</DialogTitle>
            </div>
            <Button
              onClick={handleSave}
              className="bg-white text-black hover:bg-gray-200 rounded-full font-bold px-6"
            >
              Save
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Cover Image */}
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg" />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70"
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>

          {/* Avatar */}
          <div className="flex items-start gap-4 -mt-16 px-4">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-black">
                <AvatarImage
                  src={
                    avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentAddress}`
                  }
                />
                <AvatarFallback className="text-4xl">
                  {username[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70"
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 px-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-400">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                className="bg-transparent border-gray-700 focus:border-blue-500"
                maxLength={50}
              />
              <p className="text-xs text-gray-500 text-right">
                {username.length}/50
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-400">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                className="bg-transparent border-gray-700 focus:border-blue-500 min-h-[100px] resize-none"
                maxLength={280}
              />
              <p className="text-xs text-gray-500 text-right">
                {bio.length}/280
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar" className="text-gray-400">
                Avatar URL (optional)
              </Label>
              <Input
                id="avatar"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://... or leave empty for generated avatar"
                className="bg-transparent border-gray-700 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500">
                Enter a URL to a custom avatar image, or leave empty to use an
                auto-generated avatar
              </p>
            </div>

            <div className="p-4 bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-400">
                <span className="font-semibold">Note:</span> Profile data is
                stored on the blockchain. Make sure your information is accurate
                before saving.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
