import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

type AuthTokenPayload = JwtPayload & { userId: string };
function hasUserId(payload: string | JwtPayload): payload is AuthTokenPayload {
  return typeof payload !== "string" && typeof payload.userId === "string";
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ error: "Unauthorized - no token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (!hasUserId(decoded)) {
      return res
        .status(401)
        .json({ error: "Unauthorized - invalid token payload" });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - invalid token" });
  }
}
