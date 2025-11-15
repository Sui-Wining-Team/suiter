import { useState, useRef } from "react";
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
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Camera, Loader2, X } from "lucide-react";
import { uploadToWalrus, validateFile } from "@/lib/walrusUpload";
import { getWalrusBlobUrl } from "@/lib/walrusConfig";
import { toast } from "sonner";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    username: string,
    name: string,
    bio: string,
    avatarBlobId: string,
  ) => Promise<void>;
  initialData?: {
    username?: string;
    name?: string;
    bio?: string;
    avatarBlobId?: string;
  };
  isCreating?: boolean;
}

export function ProfileEditModal({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  isCreating = false,
}: ProfileEditModalProps) {
  const currentAccount = useCurrentAccount();
  const [username, setUsername] = useState(initialData.username || "");
  const [name, setName] = useState(initialData.name || "");
  const [bio, setBio] = useState(initialData.bio || "");
  const [avatarBlobId, setAvatarBlobId] = useState(
    initialData.avatarBlobId || "",
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData.avatarBlobId
      ? getWalrusBlobUrl(initialData.avatarBlobId)
      : null,
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, 5); // 5MB limit for avatars
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed for avatars");
      return;
    }

    setUploading(true);
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);

    try {
      toast.loading("Uploading avatar...", { id: "avatar-upload" });
      const result = await uploadToWalrus(file);
      setAvatarBlobId(result.blobId);
      setAvatarPreview(getWalrusBlobUrl(result.blobId));
      toast.success("Avatar uploaded successfully!", { id: "avatar-upload" });
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Failed to upload avatar", { id: "avatar-upload" });
      setAvatarPreview(null);
      setAvatarBlobId("");
    } finally {
      setUploading(false);
    }

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!currentAccount) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!username.trim() || !name.trim()) {
      toast.error("Username and name are required");
      return;
    }

    if (username.length < 3 || username.length > 20) {
      toast.error("Username must be between 3 and 20 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      toast.error(
        "Username can only contain letters, numbers, and underscores",
      );
      return;
    }

    if (isCreating && !avatarBlobId) {
      toast.error("Please upload an avatar");
      return;
    }

    setSaving(true);
    try {
      await onSave(username, name, bio, avatarBlobId || "default_avatar");
      onClose();
    } catch (error) {
      console.error("Failed to save profile:", error);
      // Error toast is handled by the parent component
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {isCreating ? "Create Profile" : "Edit Profile"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full h-8 w-8 p-0"
              disabled={saving}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} />
                ) : (
                  <AvatarImage
                    src={
                      currentAccount
                        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentAccount.address}`
                        : undefined
                    }
                  />
                )}
                <AvatarFallback>
                  {username.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <Button
                type="button"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || saving}
                className="absolute bottom-0 right-0 rounded-full bg-blue-500 hover:bg-blue-600 h-10 w-10 p-0"
              >
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="hidden"
                disabled={uploading || saving}
              />
            </div>

            <p className="text-sm text-gray-500">
              Click the camera icon to upload an avatar
            </p>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username*</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username (3-20 characters)"
              disabled={saving || !isCreating}
              maxLength={20}
              className="bg-transparent border-gray-700 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500">
              Letters, numbers, and underscores only. Cannot be changed later.
            </p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Display Name*</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your display name"
              disabled={saving}
              maxLength={50}
              className="bg-transparent border-gray-700 focus:border-blue-500"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              disabled={saving}
              maxLength={160}
              rows={3}
              className="bg-transparent border-gray-700 focus:border-blue-500 resize-none"
            />
            <p className="text-xs text-gray-500 text-right">{bio.length}/160</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="border-gray-700 hover:bg-gray-900"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || uploading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isCreating ? (
                "Create Profile"
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
