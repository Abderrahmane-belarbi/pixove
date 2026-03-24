import cloudinary from "../config/cloudinary";

export type MediaType = "image" | "video";

export type MediaInput = {
  url?: string;
  type: MediaType;
  name?: string;
  size?: number; // will be overridden with real value
};

export const MAX_MEDIA_ITEMS = 5;
const MAX_IMAGE_BYTES = 7 * 1024 * 1024; // 7MB
const MAX_VIDEO_BYTES = 20 * 1024 * 1024; // 20MB

//
// -----------------------------
// BASIC VALIDATION
// -----------------------------
//

export function isTrustedCloudinaryUrl(url: string) {
  try {
    const parsed = new URL(url);
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (parsed.hostname !== "res.cloudinary.com") return false;
    if (parsed.protocol !== "https:") return false;

    if (!cloudName) return true;

    return parsed.pathname.startsWith(`/${cloudName}/`);
  } catch {
    return false;
  }
}

export function validateMediaPayload(mediaInput: MediaInput[]) {
  if (mediaInput.length > MAX_MEDIA_ITEMS) {
    return {
      isValid: false,
      error: `You can upload up to ${MAX_MEDIA_ITEMS} files per post.`,
    };
  }

  const hasInvalidMedia = mediaInput.some(
    (item) =>
      !item?.url ||
      typeof item.url !== "string" ||
      (item.type !== "image" && item.type !== "video"),
  );

  if (hasInvalidMedia) {
    return {
      isValid: false,
      error:
        "Invalid media payload. Each media item must include url and type (image|video).",
    };
  }

  const hasUntrustedUrl = mediaInput.some(
    (item) => !!item.url && !isTrustedCloudinaryUrl(item.url),
  );

  if (hasUntrustedUrl) {
    return {
      isValid: false,
      error: "Invalid media url. Please upload media to Cloudinary first.",
    };
  }

  return { isValid: true };
}

//
// -----------------------------
// HELPERS
// -----------------------------
//

export function extractPublicId(url: string) {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/");

    const uploadIndex = parts.findIndex((p) => p === "upload");
    if (uploadIndex === -1) return null;

    const publicIdWithExt = parts.slice(uploadIndex + 2).join("/");
    return publicIdWithExt.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}

//
// -----------------------------
// REAL VALIDATION (CRITICAL)
// -----------------------------
//

export async function validateMediaSize(
  mediaInput: MediaInput[],
): Promise<MediaInput[]> {
  const results = await Promise.all(
    mediaInput.map(async (item) => {
      if (!item.url) return null;

      const publicId = extractPublicId(item.url);
      if (!publicId) return null;

      try {
        const resource = await cloudinary.api.resource(publicId, {
          resource_type: item.type,
        });

        const isTooLarge =
          (item.type === "image" && resource.bytes > MAX_IMAGE_BYTES) ||
          (item.type === "video" && resource.bytes > MAX_VIDEO_BYTES);

        if (isTooLarge) {
          // 🔥 delete invalid file immediately
          await cloudinary.uploader.destroy(publicId, {
            resource_type: item.type,
          });
          return null;
        }

        return {
          name: item.name ?? resource.public_id,
          url: item.url,
          size: resource.bytes, // ✅ trusted size
          type: item.type,
        };
      } catch (err) {
        console.error("Cloudinary validation error:", err);
        return null;
      }
    }),
  );

  return results.filter(Boolean) as MediaInput[];
}
