import { Request, Response, NextFunction } from "express";
import Member from "../../models/members";
import { CustomError } from "../../errors/CustomError";

export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { memberId } = req.params;
        const member = await Member.findByIdAndDelete(memberId);
        if (!member) {
            throw new CustomError("Member not found", 404, "MEMBER_ERROR");
        }
        res.status(200).json({ success: true, message: "Member removed" });
    } catch (error) {
        next(error);
    }
};
