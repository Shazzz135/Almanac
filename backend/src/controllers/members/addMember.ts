import { Request, Response, NextFunction } from "express";
import Member from "../../models/members";
import { MemberRole } from "../../models/members";
import { CustomError } from "../../errors/CustomError";

export const addMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user_id, calendar_id, role } = req.body;
        if (!user_id || !calendar_id || !role) {
            throw new CustomError("user_id, calendar_id, and role are required", 400, "MEMBER_ERROR");
        }

        // Role check: only owner/editor can add members
        const requesterId = req.user?._id;
        const MemberModel = require("../../models/members").default;
        const requesterMembership = await MemberModel.findOne({ user_id: requesterId, calendar_id });
        if (!requesterMembership || (requesterMembership.role !== "owner" && requesterMembership.role !== "editor")) {
            throw new CustomError("Only owners or editors can add members", 403, "MEMBER_ERROR");
        }

        // Prevent duplicate member entries
        const existingMember = await MemberModel.findOne({ user_id, calendar_id });
        if (existingMember) {
            throw new CustomError("User is already a member of this calendar", 409, "MEMBER_ERROR");
        }

        const member = new Member({
            user_id,
            calendar_id,
            role,
        });
        await member.save();
        res.status(201).json({ success: true, member });
    } catch (error) {
        next(error);
    }
};
