import { useState } from "react";
import { getWalrusBlobUrl, isValidBlobId } from "@/lib/walrusConfig";
import { Loader2, AlertCircle } from "lucide-react";

interface MediaDisplayProps {
  blobIds: string[];
  className?: string;
}

export function MediaDisplay({ blobIds, className = "" }: MediaDisplayProps) {
  if (!blobIds || blobIds.length === 0) return null;

  const validBlobIds = blobIds.filter(isValidBlobId);
  if (validBlobIds.length === 0) return null;

  const gridClass =
    validBlobIds.length === 1
      ? "grid-cols-1"
      : validBlobIds.length === 2
        ? "grid-cols-2"
        : validBlobIds.length === 3
          ? "grid-cols-2"
          : "grid-cols-2";

  return (
    <div className={`grid ${gridClass} gap-2 mt-3 ${className}`}>
      {validBlobIds.map((blobId, index) => (
        <MediaItem key={blobId} blobId={blobId} index={index} />
      ))}
    </div>
  );
}

interface MediaItemProps {
  blobId: string;
  index: number;
}

function MediaItem({ blobId, index }: MediaItemProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);

  const mediaUrl = getWalrusBlobUrl(blobId);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  // Detect media type by trying to load as image first
  const detectMediaType = () => {
    const img = new Image();
    img.onload = () => {
      setMediaType("image");
    };
    img.onerror = () => {
      setMediaType("video");
    };
    img.src = mediaUrl;
  };

  useState(() => {
    detectMediaType();
  });

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
          <AlertCircle className="h-8 w-8 mb-2" />
          <span className="text-sm">Failed to load media</span>
        </div>
      )}

      {!error && mediaType === "image" && (
        <img
          src={mediaUrl}
          alt={`Media ${index + 1}`}
          onLoad={handleLoad}
          onError={handleError}
          className="w-full h-full object-cover"
        />
      )}

      {!error && mediaType === "video" && (
        <video
          src={mediaUrl}
          onLoadedData={handleLoad}
          onError={handleError}
          controls
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
