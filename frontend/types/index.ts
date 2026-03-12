export type UserLocal = {
  name: string;
  email: string;
  password: string;
  verificationToken: string;
  verificationTokenExpiresAt: Date;
  isVerified: boolean;
};

export type User = Omit<UserLocal, "password">;
