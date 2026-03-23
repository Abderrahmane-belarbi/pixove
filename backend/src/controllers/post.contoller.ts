import { Request, Response } from "express";
import Post from "../models/Post";

type MediaInput = {
  url?: string;
  type: "image" | "video";
  name?: string;
  size?: number;
};

const MAX_MEDIA_ITEMS = 5;

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

function normalizeMedia(mediaItems: MediaInput[]) {
  return mediaItems.map((item) => ({
    name: item.name,
    url: item.url,
    size: item.size,
    type: item.type,
  }));
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
      !item?.url ||
      typeof item.url !== "string" ||
      (item.type !== "image" && item.type !== "video"),
  );

  if (hasInvalidMedia) {
    return res.status(400).json({
      error:
        "Invalid media payload. Each media item must include url and type (image|video).",
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
    const createdPost = await Post.create({
      userId,
      title: cleanTitle,
      description: cleanDescription,
      media: normalizeMedia(mediaInput),
    });

    return res.status(201).json(createdPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create post" });
  }
}
