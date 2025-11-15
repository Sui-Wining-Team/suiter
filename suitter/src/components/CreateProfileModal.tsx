import { useState } from "react";
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
import { Camera } from "lucide-react";

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProfile: (data: {
    username: string;
    name: string;
    bio: string;
    avatarBlobId: string;
  }) => Promise<void>;
}

export function CreateProfileModal({
  isOpen,
  onClose,
  onCreateProfile,
}: CreateProfileModalProps) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !name.trim()) {
      alert("Username and name are required");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Upload avatar to Walrus and get blob ID
      const avatarBlobId = ""; // Placeholder for now
      
      await onCreateProfile({
        username: username.trim(),
        name: name.trim(),
        bio: bio.trim(),
        avatarBlobId,
      });
      
      // Reset form
      setUsername("");
      setName("");
      setBio("");
      setAvatarPreview("");
      onClose();
    } catch (error) {
      console.error("Profile creation failed:", error);
      alert("Failed to create profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-gray-800 max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Create Your Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback className="bg-blue-600 text-2xl">
                  {name[0] || username[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <Camera className="h-4 w-4 text-white" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">
                Upload a profile picture
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Recommended: Square image, at least 400x400px
              </p>
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="bg-transparent border-gray-700 text-white placeholder:text-gray-500"
              maxLength={15}
              required
            />
            <p className="text-xs text-gray-500">
              {username.length}/15 characters
            </p>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Display Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="bg-transparent border-gray-700 text-white placeholder:text-gray-500"
              maxLength={50}
              required
            />
            <p className="text-xs text-gray-500">
              {name.length}/50 characters
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the world about yourself..."
              className="bg-transparent border-gray-700 text-white placeholder:text-gray-500 resize-none min-h-[100px]"
              maxLength={160}
            />
            <p className="text-xs text-gray-500">
              {bio.length}/160 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !username.trim() || !name.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold px-6"
            >
              {isSubmitting ? "Creating..." : "Create Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
