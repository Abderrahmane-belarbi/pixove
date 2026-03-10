import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    name: String,
    username: {
      type: String,
      required: true,
    },
    picture: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    verificationResendAvailableAt: Date,
    phone: String,
    location: String,
    birthDate: Date,
    bio: String,
  },
  { timestamps: true },
);

const User = model("User", UserSchema);

export default User;
