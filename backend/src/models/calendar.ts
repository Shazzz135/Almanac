import mongoose, { Document, Schema } from "mongoose";

export enum CalendarType {
	PERSONAL = "personal",
	GROUP = "group",
}

export interface ICalendar extends Document {
	calendar_id: mongoose.Types.ObjectId;
	owner_id: mongoose.Types.ObjectId;
	name: string;
	description?: string;
	type: CalendarType;
	createdAt: Date;
	updatedAt: Date;
}

const CalendarSchema: Schema = new Schema(
	{
		owner_id: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		name: {
			type: String,
			required: [true, "A calendar name is required."],
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		type: {
			type: String,
			enum: Object.values(CalendarType),
			required: true,
			default: CalendarType.PERSONAL,
		},
	},
	{
		timestamps: true,
	}
);

CalendarSchema.index({ owner_id: 1, name: 1 });

const Calendar = mongoose.model<ICalendar>("Calendar", CalendarSchema);

export default Calendar;