export type UserLocal = {
  _id?: string;
  name: string;
  email: string;
  bio?: string;
  picture?: string;
  password: string;
  verificationToken: string;
  verificationTokenExpiresAt: Date;
  isVerified: boolean;
};

export type User = Omit<UserLocal, "password">;
