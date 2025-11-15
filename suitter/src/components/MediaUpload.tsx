import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image, X, Video, FileText } from "lucide-react";

interface MediaUploadProps {
  onMediaChange: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
}

export function MediaUpload({
  onMediaChange,
  maxFiles = 4,
  accept = "image/*,video/*",
}: MediaUploadProps) {
  const [previews, setPreviews] = useState<
    { url: string; type: string; file: File }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (previews.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files`);
      return;
    }

    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
      file,
    }));

    const updated = [...previews, ...newPreviews];
    setPreviews(updated);
    onMediaChange(updated.map((p) => p.file));
  };

  const removePreview = (index: number) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onMediaChange(updated.map((p) => p.file));
    
    // Clean up object URL
    URL.revokeObjectURL(previews[index].url);
  };

  const getMediaIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-5 w-5" />;
    if (type.startsWith("video/")) return <Video className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  return (
    <div>
      {previews.length > 0 && (
        <div
          className={`mb-3 rounded-2xl overflow-hidden border border-gray-700 ${
            previews.length === 1
              ? "max-h-[400px]"
              : previews.length === 2
              ? "grid grid-cols-2 gap-0.5"
              : previews.length === 3
              ? "grid grid-cols-2 gap-0.5"
              : "grid grid-cols-2 gap-0.5"
          }`}
        >
          {previews.map((preview, i) => (
            <div
              key={i}
              className={`relative group ${
                previews.length === 3 && i === 0 ? "row-span-2" : ""
              }`}
            >
              {preview.type.startsWith("image/") ? (
                <img
                  src={preview.url}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : preview.type.startsWith("video/") ? (
                <video
                  src={preview.url}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  {getMediaIcon(preview.type)}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removePreview(i)}
                className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {previews.length < maxFiles && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-full"
          >
            <Image className="h-5 w-5" />
          </Button>
        </>
      )}
    </div>
  );
}
