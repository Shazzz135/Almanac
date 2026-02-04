import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcrypt';

// User roles enum for Role-Based Access Control (RBAC)
export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

/**
 * Represents a User of the app
 * @property _id - Unique identifier for the user
 * @property name - Full name of the user
 * @property email - Email of the user (unique, lowercase, indexed)
 * @property password - The hashed password of the user (bcrypt)
 * @property role - The User's assigned role (admin or user)
 * @property isActive - Whether the user account is active (for soft deletion)
 * @property lastLogin - The date of this user's last login
 * @property pendingNewPassword - Temporarily stores new password during 2FA verification
 * @property twoFactorCode - Hashed 6-digit verification code for password reset
 * @property twoFactorCodeExpiry - Expiration time for the 2FA code (5 minutes)
 * @property lastPasswordResetAt - Timestamp of last password reset (for rate limiting)
 * @property createdAt - The date this user object was created (auto-managed)
 * @property updatedAt - The date this user object was last updated (auto-managed)
 * @property comparePassword - Method to compare entered password with hashed password
 */
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    lastLogin?: Date;
    pendingNewPassword?: string;
    twoFactorCode?: string;
    twoFactorCodeExpiry?: Date;
    lastPasswordResetAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(enteredPassword: string): Promise<boolean>;
    failedLoginAttempts: number;
    lockUntil?: Date;
    isEmailVerified: boolean;
    emailVerificationCode?: string;
    emailVerificationCodeExpiry?: Date;
    preferences: {
        timezone: string;
        notifications: {
            email: boolean;
            sms: boolean;
            push: boolean;
        };
    };
}

const PreferencesSchema = new Schema(
    {
        timezone: {
            type: String,
            default: "America/Toronto",
            trim: true,
        },
        notifications: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
            push: { type: Boolean, default: true },
        },
    },
    { _id: false }
);

const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, "A name is required."],
            trim: true
        },
        email: {
            type: String,
            required: [true, "An email is required."],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
            match: [/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, "Invalid email address"]
        },
        password: {
            type: String,
            required: [true, "A password is required."],
            minlength: [6, "Password must be at least 6 characters long."],
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true,
            default: UserRole.USER,
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
        },
        pendingNewPassword: {
            type: String,
        },
        twoFactorCode: {
            type: String,
        },
        twoFactorCodeExpiry: {
            type: Date,
        },
        lastPasswordResetAt: {
            type: Date,
        },
        failedLoginAttempts: {
            type: Number,
            default: 0,
        },
        lockUntil: {
            type: Date,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationCode: {
            type: String,
        },
        emailVerificationCodeExpiry: {
            type: Date,
        },
        preferences: {
            type: PreferencesSchema,
            default: () => ({}),
        },
    },
    {
        timestamps: true,
        discriminatorKey: 'role',
    }
);

// Hash password before saving using bcrypt
UserSchema.pre('save', async function (next: any) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
});

/**
 * Compare entered password with hashed password in database
 * Used during login to verify user credentials
 * @param enteredPassword - Plain text password entered by user
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
UserSchema.methods.comparePassword = async function (
    enteredPassword: string
): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.index({ name: 1, email: 1 });
UserSchema.index({ role: 1 });

const User = mongoose.model<IUser>("User", UserSchema);

export default User;