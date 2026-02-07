import mongoose, { Document, Schema } from "mongoose";

export interface IPendingUser extends Document {
  name: string;
  email: string;
  password: string;
  verificationCode: string;
  verificationCodeExpiry: Date;
}

const PendingUserSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  verificationCode: { type: String, required: true },
  verificationCodeExpiry: { type: Date, required: true },
}, { timestamps: true });

const PendingUser = mongoose.model<IPendingUser>("PendingUser", PendingUserSchema);

export default PendingUser;
