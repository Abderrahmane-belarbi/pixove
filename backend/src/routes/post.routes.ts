import express from "express";
import { createPost, getPosts } from "../controllers/post.contoller";
import { verifyToken } from "../middleware/verify-token";

const router = express.Router();

router.post("/create-post", verifyToken, createPost);
router.get("/posts", getPosts);
export default router;
