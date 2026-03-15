import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { sendMail } from "../config/google-mailer";
import User from "../models/User";
import { generateToken } from "../utils/generate-token";
import {
  generateVerificationToken,
  generateVerificationTokenExpiresAt,
} from "../utils/generate-verification-token";

export async function checkAuth(req: Request, res: Response) {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ message: "User found", user });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(500).json({ error: message });
  }
}

function getGoogleClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.NODE_ENV === "development"
      ? process.env.LOCAL_GOOGLE_REDIRECT_URI
      : process.env.PUBLIC_GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri)
    throw new Error("Google client credentials not found");
  return new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri,
  });
}

function setGoogleOAuthStateCookie(res: Response, state: string) {
  res.cookie("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000, // 10 minutes
  });
}

function clearGoogleOAuthStateCookie(res: Response) {
  res.clearCookie("google_oauth_state", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
  });
}

export async function googleLoginHandler(req: Request, res: Response) {
  try {
    const client = getGoogleClient();
    const state = crypto.randomBytes(32).toString("hex");
    setGoogleOAuthStateCookie(res, state);
    const url = client.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "profile", "email"],
      prompt: "consent",
      state, // for CSRF protection
    });
    return res.redirect(url);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(500).json({ error: message });
  }
}

export async function googleCallbackHandler(req: Request, res: Response) {
  const code = req.query.code;
  const state = req.query.state;
  const stateFromCookie = req.cookies?.google_oauth_state;
  if (!code || typeof code !== "string")
    return res.status(400).json({ error: "Code not found" });
  if (
    !state ||
    typeof state !== "string" ||
    !stateFromCookie ||
    state !== stateFromCookie
  ) {
    clearGoogleOAuthStateCookie(res);
    return res.status(400).json({ error: "Invalid OAuth state" });
  }
  try {
    clearGoogleOAuthStateCookie(res);
    const client = getGoogleClient();
    const { tokens } = await client.getToken(code);
    if (!tokens?.id_token)
      return res.status(400).json({ error: "Google ID token not found" });
    // verify token and read the user info from it
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ error: "Invalid Google token payload" });
    }
    const email = payload?.email;
    const emailVerified = payload?.email_verified;
    if (!email || !emailVerified)
      return res.status(400).json({ error: "Email not verified" });
    const emailNormalized = email.toLowerCase().trim();
    let user = await User.findOne({ email: emailNormalized });
    if (!user) {
      user = await User.create({
        name: payload?.name,
        email: emailNormalized,
        password: undefined,
        isVerified: true,
        picture: payload?.picture,
      });
    } else {
      if (!user.isVerified) {
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
      }
      await user.save();
    }
    generateToken(user._id);
    const redirectUrl = `${process.env.NODE_ENV === "development" ? process.env.LOCAL_CLIENT_URL : process.env.PUBLIC_CLIENT_URL}/dashboard`;
    return res.redirect(redirectUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}

export async function signup(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        error: "Email, password and name are required",
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(409).json({ error: "Email already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiresAt = generateVerificationTokenExpiresAt();

    const createdUser = await User.create({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt,
    });

    if (!createdUser) {
      return res.status(500).json({ error: "Failed to create user" });
    }

    //sendMail({
    //  to: createdUser.email,
    //  subject: "Verify your email",
    //  text: `Your verification code is ${verificationToken}`,
    //});

    return res.status(201).json({
      message: "User created successfully, Please verify your email.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    // we put Invalid credentials for both email and password for security reasons
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    if (!user.isVerified)
      return res
        .status(403)
        .json({ error: "Please verify your email before logging in" });

    const passwordMatch = await bcrypt.compare(password, user.password!);

    if (!passwordMatch)
      return res.status(400).json({ error: "Invalid credentials" });

    // jwt
    const token = generateToken(user._id);

    return res.status(200).json({
      message: "User Logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        picture: user?.picture,
        isVerified: user?.isVerified,
      },
      accessToken: token,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}

export function logout(req: Request, res: Response) {
  try {
    // TODO: deleting Refresh token from the database
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}

export async function resendVerificationEmail(req: Request, res: Response) {
  try {
    const resetCooldown = parseInt(
      process.env.VERIFICATION_RESEND_COOLDOWN_SECONDS!,
    );

    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    let remainingSeconds = 0;

    if (user.verificationResendAvailableAt) {
      const availableAt = user.verificationResendAvailableAt.getTime(); // milliseconds
      remainingSeconds = Math.max(
        0,
        Math.ceil((availableAt - Date.now()) / 1000),
      );
    }

    if (remainingSeconds > 0) {
      // 429 Too many requests
      return res.status(429).json({
        message: `You can request a new verification code in ${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}.`,
      });
    }

    const verificationToken = generateVerificationToken();
    const verificationTokenExpiresAt = generateVerificationTokenExpiresAt();

    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = new Date(verificationTokenExpiresAt);
    user.verificationResendAvailableAt = new Date(
      Date.now() + resetCooldown * 1000,
    );
    await user.save();

    sendMail({
      to: user.email,
      subject: "Verify your email",
      text: `Your verification code is ${verificationToken}`,
    });
    return res.status(200).json({
      message:
        "Verification code resent successfully. It may take up to a minute to arrive.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}

export async function verificationEmail(req: Request, res: Response) {
  try {
    const { code, email } = req.body;
    if (!code || !email)
      return res.status(400).json({ message: "Required fields are missing" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Please Signup first" });

    if (user.isVerified)
      return res.status(410).json({ message: "Email already verified" });

    if (!user.verificationToken || !user.verificationTokenExpiresAt) {
      return res.status(400).json({ message: "No active verification token" });
    }

    if (String(user.verificationToken) !== String(code))
      return res.status(400).json({ message: "Invalid verification code" });

    if (Date.now() > new Date(user.verificationTokenExpiresAt).getTime()) {
      return res.status(400).json({ message: "Token expired" });
    }

    user.isVerified = true;
    user.verificationTokenExpiresAt = undefined;
    user.verificationToken = undefined;
    await user.save();

    // jwt
    generateToken(user._id);

    return res.status(200).json({
      message: "The email has been verified successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      // Generate reset token and hash it for security
      const resetPasswordToken = crypto.randomUUID();
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetPasswordToken)
        .digest("hex");
      // Update user token
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 min
      await user.save();

      // Send email to user resetPasswordToken not the hashed
      // Send the raw token to the user in the link
      // When user comes back with raw token, you hash it and compare to DB
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;
      sendMail({
        to: user.email,
        subject: "Reset your password",
        text: `You requested a password reset. Use this link to reset your password:\n${resetUrl} (expires in 10 minutes).\nIf you didn't request this, ignore this email.`,
      });
    }

    return res.status(200).json({
      message:
        "If an account exists, a reset link has been sent. Check your inbox and spam folder.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const rawToken = req.params.token;
    const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: "Password required" });
    if (!token) return res.status(400).json({ error: "Token required" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiresAt: {
        $gt: Date.now(), // find the user if thier token not expires by check gt: grater than
      },
    });

    if (!user)
      return res
        .status(400)
        .json({ error: "Invalid or expired reset password token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
