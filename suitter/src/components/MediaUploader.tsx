import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image, Video, X, Loader2 } from "lucide-react";
import { uploadToWalrus, validateFile } from "@/lib/walrusUpload";
import { getWalrusBlobUrl } from "@/lib/walrusConfig";
import { toast } from "sonner";

interface MediaFile {
  file: File;
  preview: string;
  blobId?: string;
  uploading: boolean;
}

interface MediaUploaderProps {
  onMediaChange: (blobIds: string[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

export function MediaUploader({
  onMediaChange,
  maxFiles = 4,
  disabled = false,
}: MediaUploaderProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []);

    if (mediaFiles.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate and create previews
    const newMediaFiles: MediaFile[] = [];

    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        toast.error(validation.error);
        continue;
      }

      const preview = URL.createObjectURL(file);
      newMediaFiles.push({
        file,
        preview,
        uploading: true,
      });
    }

    if (newMediaFiles.length === 0) return;

    // Add to state
    setMediaFiles((prev) => [...prev, ...newMediaFiles]);

    // Upload to Walrus
    for (let i = 0; i < newMediaFiles.length; i++) {
      const mediaFile = newMediaFiles[i];
      try {
        const result = await uploadToWalrus(mediaFile.file);

        // Update with blob ID
        setMediaFiles((prev) =>
          prev.map((mf) =>
            mf.preview === mediaFile.preview
              ? { ...mf, blobId: result.blobId, uploading: false }
              : mf,
          ),
        );

        toast.success(`Uploaded ${mediaFile.file.name}`);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload ${mediaFile.file.name}`);

        // Remove failed upload
        setMediaFiles((prev) =>
          prev.filter((mf) => mf.preview !== mediaFile.preview),
        );
      }
    }

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Update parent when blob IDs change
  useState(() => {
    const blobIds = mediaFiles
      .filter((mf) => mf.blobId && !mf.uploading)
      .map((mf) => mf.blobId!);
    onMediaChange(blobIds);
  });

  const removeMedia = (preview: string) => {
    setMediaFiles((prev) => {
      const filtered = prev.filter((mf) => mf.preview !== preview);
      const blobIds = filtered
        .filter((mf) => mf.blobId && !mf.uploading)
        .map((mf) => mf.blobId!);
      onMediaChange(blobIds);
      return filtered;
    });
    URL.revokeObjectURL(preview);
  };

  const isImage = (file: File) => file.type.startsWith("image/");
  const isVideo = (file: File) => file.type.startsWith("video/");

  return (
    <div className="space-y-2">
      {/* Media previews */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {mediaFiles.map((mediaFile) => (
            <div key={mediaFile.preview} className="relative group">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                {isImage(mediaFile.file) && (
                  <img
                    src={mediaFile.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
                {isVideo(mediaFile.file) && (
                  <video
                    src={mediaFile.preview}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}

                {/* Upload overlay */}
                {mediaFile.uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}

                {/* Remove button */}
                {!mediaFile.uploading && (
                  <button
                    onClick={() => removeMedia(mediaFile.preview)}
                    className="absolute top-1 right-1 bg-black/70 hover:bg-black rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {mediaFiles.length < maxFiles && (
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
          >
            <Image className="h-4 w-4 mr-1" />
            Image
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
          >
            <Video className="h-4 w-4 mr-1" />
            Video
          </Button>
        </div>
      )}
    </div>
  );
}
