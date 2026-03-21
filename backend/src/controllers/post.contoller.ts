import { Request, Response } from "express";
import Post from "../models/Post";

export async function createPost(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { title, description } = req.body;
  const cleanTitle = title?.trim();
  const cleanDescription = description?.trim();
  if (!cleanTitle)
    return res.status(400).json({ error: "Title field is required" });
  try {
    const createdPost = await Post.create({
      userId,
      title: cleanTitle,
      description: cleanDescription,
    });
    return res.status(201).json(createdPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create post" });
  }
}
