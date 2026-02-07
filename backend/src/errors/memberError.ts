import { CustomError } from "./CustomError";

export class MemberError extends CustomError {
    constructor(message: string, statusCode = 400, code = "MEMBER_ERROR") {
        super(message, statusCode, code);
        this.name = "MemberError";
    }
}
