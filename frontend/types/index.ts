export type User = {
  name: string;
  email: string;
  password: string;
  verificationToken: string;
  verificationTokenExpiresAt: Date;
  isVerified: boolean;
};
