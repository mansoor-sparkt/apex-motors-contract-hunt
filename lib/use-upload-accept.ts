"use client";
import { useEffect, useState } from "react";
import { isAndroid } from "@/lib/platform";
import { IMAGE_UPLOAD_ACCEPT } from "@/lib/image-to-png";
import { VIDEO_UPLOAD_ACCEPT } from "@/lib/media-upload";

export function useUploadAccept(kind: "image" | "video") {
  // SSR + first client render: broad string (camera-safe + matches server).
  const [accept, setAccept] = useState(
    kind === "image" ? IMAGE_UPLOAD_ACCEPT : VIDEO_UPLOAD_ACCEPT,
  );

  useEffect(() => {
    if (isAndroid()) {
      // Plain mime keeps the camera visible; Android shoots jpg/mp4 anyway.
      setAccept(kind === "image" ? "image/*" : "video/*");
    }
  }, [kind]);

  return accept;
}
