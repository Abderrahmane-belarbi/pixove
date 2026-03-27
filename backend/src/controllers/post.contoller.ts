import { Request, Response } from "express";
import Post from "../models/Post";
import {
  validateMediaPayload,
  validateMediaSize,
} from "../utils/media-validation";

type MediaInput = {
  url?: string;
  type: "image" | "video";
  name?: string;
  size?: number;
};

export async function createPost(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { title, description, media } = req.body;

  const cleanTitle = title?.trim();
  if (!cleanTitle)
    return res.status(400).json({ error: "Title field is required" });

  const cleanDescription = description?.trim() ?? "";
  const mediaInput: MediaInput[] = Array.isArray(media) ? media : [];

  // 1. basic validation
  const { isValid, error } = validateMediaPayload(mediaInput);
  if (!isValid) {
    return res.status(400).json({ error });
  }

  // 2. real validation (Cloudinary)
  const cleanedMedia = await validateMediaSize(mediaInput);

  // 3. reject if something was removed
  if (cleanedMedia.length !== mediaInput.length) {
    return res.status(400).json({
      error: "One or more files exceeded size limits and were removed.",
    });
  }

  try {
    const createdPost = await Post.create({
      userId,
      title: cleanTitle,
      description: cleanDescription,
      media: cleanedMedia,
    });

    return res.status(201).json(createdPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create post" });
  }
}

export async function getPosts(req: Request, res: Response) {
  try {
    const posts = await Post.find();
    if (posts.length === 0)
      return res.status(200).json({ message: "No posts", posts: [] });
    return res.status(200).json({
      message: "Getting Post seccessfuly",
      posts,
    });
  } catch (error) {
    const getPostsError =
      error instanceof Error ? error.message : "Getting post operation failed";
    console.log(error);
    return res.status(500).json({ error: getPostsError });
  }
}
