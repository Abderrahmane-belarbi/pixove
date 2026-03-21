import express from "express";
import { createPost } from "../controllers/post.contoller";
import { verifyToken } from "../middleware/verify-token";

const router = express.Router();

router.post("/create-post", verifyToken, createPost);

export default router;
