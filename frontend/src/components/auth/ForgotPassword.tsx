import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useFormValidation } from "../../hooks/auth/useFormValidation";
import { forgotPassword } from "../../services/auth/authApi";

export default function ForgotPassword() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const { validationError, setValidationError, clearError, isEmailValid } = useFormValidation();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		clearError();

		if (!email) {
			setValidationError("Please enter your email");
			return;
		}

		if (!isEmailValid(email)) {
			setValidationError("Please enter a valid email");
			return;
		}

		setLoading(true);
		try {
			await forgotPassword({ email: email.toLowerCase() });
			// Store email and flow type for 2FA
			sessionStorage.setItem('resetEmail', email.toLowerCase());
			sessionStorage.setItem('authFlow', 'password-reset');
			
			// Show success for 1 second before navigating
			await new Promise(resolve => setTimeout(resolve, 1000));
			navigate("/auth/2fa");
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to send reset code';
			setValidationError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center py-8 px-4 sm:px-6 md:px-0">
			<div className="w-full sm:w-96 md:max-w-lg flex flex-col items-center justify-center">
				{/* Main header */}
				<div className="text-center mb-6 sm:mb-8">
					<h3 className="text-2xl sm:text-3xl md:text-4xl font-bold">Forgot Password</h3>
				</div>

				{/* Instructions */}
				<div className="text-center mb-6 sm:mb-8">
					<p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
						Enter the email you used to create your account so we can send you instructions on how to reset your password
					</p>
				</div>

				{/* Error message */}
				{validationError && (
					<div className="w-full bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-xs sm:text-sm mb-6 animate-pulse">
						{validationError}
					</div>
				)}

				<form className="w-full space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
					{/* Email input */}
					<div className="space-y-2">
						<label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-200">Email</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
							placeholder="Enter your email address"
							required
							className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
						/>
					</div>

					{/* Back to login link */}
					<div className="flex justify-start pt-1">
						<Link 
							to="/auth/login" 
							className="text-xs sm:text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 transition"
						>
							<ArrowLeft size={16} />
							Back To Login
						</Link>
					</div>

					{/* Send Code button */}
					<button
						type="submit"
						className="w-full rounded-lg h-12 sm:h-13 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all"
						disabled={!email || !isEmailValid(email) || loading}
					>
						{loading ? "Sending..." : "Send Code"}
					</button>
				</form>
			</div>
		</div>
	);
}
