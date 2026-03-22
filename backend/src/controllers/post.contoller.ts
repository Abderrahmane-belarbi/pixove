import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import Post from "../models/Post";

type MediaInput = {
  dataUri?: string;
  url?: string;
  type: "image" | "video";
  name?: string;
  size?: number;
};

const MAX_MEDIA_ITEMS = 5;
const MAX_SINGLE_FILE_BYTES = 100 * 1024 * 1024; // 100MB

function estimateBase64Bytes(dataUri: string) {
  const parts = dataUri.split(",");
  const payload = parts[1] ?? "";
  return Math.ceil((payload.length * 3) / 4);
}

function isTrustedCloudinaryUrl(url: string) {
  try {
    const parsed = new URL(url);
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const isCloudinaryHost = parsed.hostname === "res.cloudinary.com";
    if (!isCloudinaryHost || parsed.protocol !== "https:") return false;
    if (!cloudName) return true;
    return parsed.pathname.startsWith(`/${cloudName}/`);
  } catch {
    return false;
  }
}

async function uploadMediaToCloudinary(mediaItems: MediaInput[]) {
  if (!mediaItems.length) return [];

  const uploads = mediaItems.map(async (item) => {
    if (item.url) {
      return {
        name: item.name,
        url: item.url,
        size: item.size,
        type: item.type,
      };
    }
    if (!item.dataUri) throw new Error("Missing media source.");

    const uploadResult = await cloudinary.uploader.upload(item.dataUri, {
      folder: "pixove/posts",
      resource_type: item.type === "video" ? "video" : "image",
    });

    return {
      name: item.name ?? uploadResult.original_filename,
      url: uploadResult.secure_url,
      size: item.size ?? uploadResult.bytes,
      type: item.type,
    };
  });

  return Promise.all(uploads);
}

export async function createPost(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { title, description, media } = req.body;

  const cleanTitle = title?.trim();
  if (!cleanTitle)
    return res.status(400).json({ error: "Title field is required" });

  const cleanDescription = description?.trim() ?? "";

  const mediaInput: MediaInput[] = Array.isArray(media) ? media : [];
  if (mediaInput.length > MAX_MEDIA_ITEMS) {
    return res.status(400).json({
      error: `You can upload up to ${MAX_MEDIA_ITEMS} files per post.`,
    });
  }
  const hasInvalidMedia = mediaInput.some(
    (item) =>
      (!item?.dataUri && !item?.url) ||
      (item.type !== "image" && item.type !== "video") ||
      (item.dataUri !== undefined && typeof item.dataUri !== "string") ||
      (item.url !== undefined && typeof item.url !== "string"),
  );
  if (hasInvalidMedia) {
    return res.status(400).json({
      error:
        "Invalid media payload. Each media item must include dataUri or url and type (image|video).",
    });
  }
  const hasOversizedBase64 = mediaInput.some(
    (item) =>
      !!item.dataUri &&
      typeof item.dataUri === "string" &&
      estimateBase64Bytes(item.dataUri) > MAX_SINGLE_FILE_BYTES,
  );
  if (hasOversizedBase64) {
    return res.status(400).json({
      error: "One or more media files exceeds the 100MB size limit.",
    });
  }
  const hasUntrustedUrl = mediaInput.some(
    (item) => !!item.url && !isTrustedCloudinaryUrl(item.url),
  );
  if (hasUntrustedUrl) {
    return res.status(400).json({
      error: "Invalid media url. Please upload media to Cloudinary first.",
    });
  }

  try {
    const uploadedMedia = await uploadMediaToCloudinary(mediaInput);

    const createdPost = await Post.create({
      userId,
      title: cleanTitle,
      description: cleanDescription,
      media: uploadedMedia,
    });
    return res.status(201).json(createdPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create post" });
  }
}
