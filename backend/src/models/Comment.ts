import { model, models, Schema, Types } from "mongoose";

const CommentSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    postId: { type: Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true, maxlength: 500, trim: true },
    likes: [{ type: Types.ObjectId, ref: "User" }],
    parentId: { type: Types.ObjectId, ref: "Comment", default: null },
  },
  { timestamps: true },
);

const Comment = models.Comment || model("Comment", CommentSchema);
export default Comment;
