import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormValidation } from "../../hooks/auth/useFormValidation";
import { usePasswordValidation, isPasswordValid } from "../../hooks/auth/usePasswordValidation";
import { register } from "../../services/auth/authApi";

export default function SignUp() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { validationError, setValidationError, clearError, isEmailValid } = useFormValidation();

	const passwordChecks = usePasswordValidation(password);
	const isPasswordOk = isPasswordValid(passwordChecks);
	const passwordsMatch = password === confirmPassword && confirmPassword !== "";
	const isFormValid = isPasswordOk && passwordsMatch;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		clearError();

		if (!name) {
			setValidationError("Please enter your name");
			return;
		}

		if (!email) {
			setValidationError("Please enter your email");
			return;
		}

		if (!isEmailValid(email)) {
			setValidationError("Please enter a valid email");
			return;
		}

		if (!isFormValid) {
			setValidationError("Please meet all password requirements");
			return;
		}

		setLoading(true);
		try {
			await register({ name, email: email.toLowerCase(), password });
			// Store email and flow type for 2FA
			sessionStorage.setItem('signupEmail', email.toLowerCase());
			sessionStorage.setItem('authFlow', 'signup');
			
			// Show success for 1 second before navigating
			await new Promise(resolve => setTimeout(resolve, 1000));
			navigate("/auth/2fa");
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Registration failed";
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
					<h3 className="text-2xl sm:text-3xl md:text-4xl font-bold">Sign Up</h3>
				</div>

				{/* Error message */}
				{validationError && (
					<div className="w-full bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-xs sm:text-sm mb-6 animate-pulse">
						{validationError}
					</div>
				)}

				<form className="w-full space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
					{/* Name input */}
					<div className="space-y-2">
						<label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-200">Full Name</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
							placeholder="Enter your full name"
							required
							className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
						/>
					</div>

					{/* Email input */}
					<div className="space-y-2">
						<label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-200">Email</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
							placeholder="Enter your email"
							required
							className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
						/>
					</div>

					{/* Password input */}
					<div className="space-y-2">
						<label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-200">Password</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
							placeholder="Enter password"
							required
							className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
						/>
					</div>

					{/* Confirm Password input */}
					<div className="space-y-2">
						<label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-gray-200">Confirm Password</label>
						<input
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
							placeholder="Confirm password"
							required
							className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
						/>
					</div>

					{/* Password requirements */}
					<div className="space-y-2 pt-2">
						<p className="text-xs sm:text-sm font-semibold text-gray-200">Password Requirements:</p>
						<ul className="space-y-1 text-xs sm:text-sm">
							<li className={passwordChecks.len ? "text-green-400" : "text-gray-500"}>
								{passwordChecks.len ? "✓" : "○"} At least 8 characters
							</li>
							<li className={passwordChecks.upper ? "text-green-400" : "text-gray-500"}>
								{passwordChecks.upper ? "✓" : "○"} Uppercase letter
							</li>
							<li className={passwordChecks.lower ? "text-green-400" : "text-gray-500"}>
								{passwordChecks.lower ? "✓" : "○"} Lowercase letter
							</li>
							<li className={passwordChecks.digit ? "text-green-400" : "text-gray-500"}>
								{passwordChecks.digit ? "✓" : "○"} Number
							</li>
							<li className={passwordChecks.special ? "text-green-400" : "text-gray-500"}>
								{passwordChecks.special ? "✓" : "○"} Special character
							</li>
							{passwordsMatch && (
								<li className="text-green-400">✓ Passwords match</li>
							)}
						</ul>
					</div>

					{/* Sign up button */}
					<button
						type="submit"
						className="w-full rounded-lg h-12 sm:h-13 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all"
						disabled={!isFormValid || loading}
					>
						{loading ? "Creating account..." : "Sign Up"}
					</button>

					{/* Login link */}
					<div className="text-center pt-2">
						<span className="text-xs sm:text-sm text-gray-400">Already have an account? </span>
						<Link to="/auth/login" className="text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline transition">
							Login
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
