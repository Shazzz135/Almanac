import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/auth/Login";
import SignUp from "../components/auth/SignUp";
import AccountMade from "../components/auth/AccountMade";
import ForgotPassword from "../components/auth/ForgotPassword";
import TwoFactorAuth from "../components/auth/TwoFA";
import NewPassword from "../components/auth/NewPassword";
import NewPasswordMade from "../components/auth/NewPasswordMade";

export default function Auth() {
	return (
		<Routes>
			<Route path="login" element={<Login />} />
			<Route path="signup" element={<SignUp />} />
			<Route path="account-made" element={<AccountMade />} />
			<Route path="forgot-password" element={<ForgotPassword />} />
			<Route path="2fa" element={<TwoFactorAuth />} />
			<Route path="new-password" element={<NewPassword />} />
			<Route path="new-password-made" element={<NewPasswordMade />} />
			
			{/* Catch-all for auth - redirect to login */}
			<Route path="*" element={<Navigate to="/auth/login" replace />} />
		</Routes>
	);
}
