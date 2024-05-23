import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  isVerifyed: boolean;
  isAcceptingMessage: boolean;
  verifyOTP: string;
  verifyOtpExpiry: Date;
}

const userSchema: Schema<User> = new Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[\w\.-]+@[\w\.-]+\.\w+$/,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  isVerifyed: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  verifyOTP: {
    type: String,
    required: true,
  },
  verifyOtpExpiry: {
    type: Date,
    required: true,
  },
});

const userModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);
export default userModel;
