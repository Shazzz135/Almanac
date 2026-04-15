import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
	calendar_id: mongoose.Types.ObjectId;
	title: string;
	description?: string;
	color: string;
	location?: string;
	start: Date;
	end: Date;
	allDay: boolean;
	created_by: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const EventSchema: Schema = new Schema(
	{
		calendar_id: {
			type: Schema.Types.ObjectId,
			ref: "Calendar",
			required: true,
		},
		title: {
			type: String,
			required: [true, "Event title is required."],
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		color: {
			type: String,
			required: [true, "Event color is required."],
			trim: true,
		},
		location: {
			type: String,
			trim: true,
		},
		start: {
			type: Date,
			required: [true, "Event start time is required."],
		},
		end: {
			type: Date,
			required: [true, "Event end time is required."],
		},
		allDay: {
			type: Boolean,
			default: false,
		},
		created_by: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

// Index for efficient queries by calendar
EventSchema.index({ calendar_id: 1 });
EventSchema.index({ calendar_id: 1, start: 1 });

const Event = mongoose.model<IEvent>("Event", EventSchema);

export default Event;
