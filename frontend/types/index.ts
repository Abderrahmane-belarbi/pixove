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

export type SelectedMedia = {
  uri: string;
  type: "image" | "video";
  mimeType: string;
  fileName: string;
  fileSize: number;
};

enum MediaType {
  Video = "video",
  Image = "image",
}

export type Post = {
  id: string;
  title: string;
  description?: string;
  auther: {
    id: string;
    email: string;
    name: string;
    picture: string;
    bio: string;
  };
  likes: string[];
  comments: string[];
  media: {
    name: string;
    url: string;
    size: number;
    type: MediaType;
  };
  createdAt: Date;
  updatedAt: Date;
};
