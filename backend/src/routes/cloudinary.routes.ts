// routes/cloudinary.ts
import { Router } from "express";
import cloudinary from "../config/cloudinary";
import { verifyToken } from "../middleware/verify-token";

const router = Router();

router.get("/signature", verifyToken, (_, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: process.env.CLOUDINARY_UPLOAD_FOLDER },
    process.env.CLOUDINARY_API_SECRET!,
  );

  res.json({
    signature,
    timestamp,
    folder: process.env.CLOUDINARY_UPLOAD_FOLDER,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
});

export default router;
