import express from "express";
import {
    checkAuth,
    forgotPassword,
    googleCallbackHandler,
    googleLoginHandler,
    login,
    logout,
    resendVerificationEmail,
    resetPassword,
    signup,
    verificationEmail,
} from "../controllers/auth-controller";
import updateProfile from "../controllers/user-controller.js";
import { verifyToken } from "../middleware/verify-token.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.get("/google", googleLoginHandler);
router.get("/google/callback", googleCallbackHandler);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verificationEmail);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.put("/update-profile", verifyToken, updateProfile);

export default router;
