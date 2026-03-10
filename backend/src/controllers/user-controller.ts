import { Request, Response } from "express";
import User from "../models/User";

export default async function updateProfile(req: Request, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "User unauthorized." });

    const allowedFields = ["name", "phone", "location", "birthDate", "bio"];
    let updates: Record<string, string> = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    const user = await User.findByIdAndUpdate(
      userId, // filter
      { $set: updates }, // update
      { returnDocument: "after" }, // return updated document
    );
    if (!user) return res.status(404).json({ error: "User not found." });
    return res
      .status(200)
      .json({ message: "Your changes have been saved successfully.", user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return res.status(500).json({ error: message });
  }
}
