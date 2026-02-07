import { CustomError } from "./CustomError";

export class CalendarError extends CustomError {
    constructor(message: string, statusCode = 400, code = "CALENDAR_ERROR") {
        super(message, statusCode, code);
        this.name = "CalendarError";
    }
}
