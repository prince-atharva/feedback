import mongoose, { Schema, Document } from "mongoose";
import { User } from "./user.model";

export interface Message extends Document {
  userID: Schema.Types.ObjectId | User;
  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const messageModel =
  (mongoose.models.Message as mongoose.Model<Message>) ||
  mongoose.model<Message>("Message", messageSchema);
export default messageModel;
