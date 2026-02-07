import { Request, Response, NextFunction } from "express";
import Member from "../../models/members";
import { CustomError } from "../../errors/CustomError";

export const updateMemberRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { memberId } = req.params;
        const { role } = req.body;
        if (!role) {
            throw new CustomError("Role is required", 400, "MEMBER_ERROR");
        }
        const member = await Member.findById(memberId);
        if (!member) {
            throw new CustomError("Member not found", 404, "MEMBER_ERROR");
        }

        // Role check: only owner/editor can update member roles
        const requesterId = req.user?._id;
        const MemberModel = require("../../models/members").default;
        const requesterMembership = await MemberModel.findOne({ user_id: requesterId, calendar_id: member.calendar_id });
        if (!requesterMembership || (requesterMembership.role !== "owner" && requesterMembership.role !== "editor")) {
            throw new CustomError("Only owners or editors can update member roles", 403, "MEMBER_ERROR");
        }

        member.role = role;
        await member.save();
        res.status(200).json({ success: true, member });
    } catch (error) {
        next(error);
    }
};
