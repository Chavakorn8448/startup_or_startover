import { useEffect, useState } from "react";

/**
 * Returns a dataURL (jpeg) thumbnail extracted from the first moment of the video.
 * If it fails (CORS, broken URL, etc.), it returns null.
 */
export function useVideoFirstFrame(videoUrl: string | null) {
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!videoUrl) {
        setThumb(null);
        return;
      }

      try {
        const dataUrl = await extractFirstFrame(videoUrl);
        if (!cancelled) setThumb(dataUrl);
      } catch {
        if (!cancelled) setThumb(null);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [videoUrl]);

  return thumb;
}

function extractFirstFrame(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous"; // important (CORS must allow it)
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    };

    video.onloadedmetadata = () => {
      // Seek a tiny bit forward so you don't capture a black frame
      const t = Math.min(0.1, Math.max(0, (video.duration || 0) * 0.01));
      video.currentTime = t;
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("No canvas context");

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

        cleanup();
        resolve(dataUrl);
      } catch (e) {
        cleanup();
        reject(e);
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Video load error"));
    };

    video.src = url;
  });
}
