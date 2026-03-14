import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export function generateToken(userId: Types.ObjectId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
  return token;
}
