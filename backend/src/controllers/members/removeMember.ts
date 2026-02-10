import { Request, Response, NextFunction } from "express";
import Member from "../../models/members";
import User from "../../models/user";
import { CustomError } from "../../errors/CustomError";

export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { memberId } = req.params;
        const userId = req.user?._id;
        console.log(`[removeMember] Removing member ${memberId} requested by user ${userId}`);
        
        const member = await Member.findByIdAndDelete(memberId);
        console.log(`[removeMember] Deletion result:`, member ? 'Found and deleted' : 'Member not found');
        
        if (!member) {
            throw new CustomError("Member not found", 404, "MEMBER_ERROR");
        }

        // Decrement calendarCount for user, not below 0
        const user = await User.findById(member.user_id);
        if (user && typeof user.calendarCount === "number" && user.calendarCount > 0) {
            user.calendarCount -= 1;
            await user.save();
            console.log(`[removeMember] Updated calendar count for user ${member.user_id} to ${user.calendarCount}`);
        }

        console.log(`[removeMember] Successfully removed member ${memberId}`);
        res.status(200).json({ success: true, message: "Member removed" });
    } catch (error) {
        console.error(`[removeMember] Error removing member:`, error);
        next(error);
    }
};
