
import mongoose, { Document, Schema } from "mongoose";

export enum MemberRole {
	OWNER = "owner",
	EDITOR = "editor",
	VIEWER = "viewer",
}

export interface IMember extends Document {
	user_id: mongoose.Types.ObjectId;
	calendar_id: mongoose.Types.ObjectId;
	role: MemberRole;
	joined_at?: Date;
	accepted: boolean;
}

const MemberSchema: Schema = new Schema(
	{
		user_id: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		calendar_id: {
			type: Schema.Types.ObjectId,
			ref: "Calendar",
			required: true,
		},
		role: {
			type: String,
			enum: Object.values(MemberRole),
			required: true,
			default: MemberRole.VIEWER,
		},
		joined_at: {
			type: Date,
			required: false,
		},
		accepted: {
			type: Boolean,
			default: false,
		},
	}
);

MemberSchema.index({ user_id: 1, calendar_id: 1 });

const Member = mongoose.model<IMember>("Member", MemberSchema);

export default Member;