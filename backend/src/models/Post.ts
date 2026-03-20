import { Schema, Types, model, models } from "mongoose";

const FileSchema = new Schema({
  name: { type: String },
  url: { type: String, required: true },
  size: { type: Number },
  type: { type: String, enum: ["image", "video"] },
});

const PostSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: String,
    likes: [{ type: Types.ObjectId, ref: "User" }],
    comments: [{ type: Types.ObjectId, ref: "Comment" }],
    media: [FileSchema],
  },
  { timestamps: true },
);

const Post = models.Post || model("Post", PostSchema);
export default Post;
