import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormValidation } from "../../hooks/auth/useFormValidation";
import { useAuth } from "../../hooks/auth/useAuth";

export default function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
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

		if (!password) {
			setValidationError("Please enter your password");
			return;
		}

		setLoading(true);
		try {
			await login(email.toLowerCase(), password);
			navigate("/bench");
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Login failed";
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
					<h3 className="text-2xl sm:text-3xl md:text-4xl font-bold">Login</h3>
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
							placeholder="Enter your password"
							required
							className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
						/>
					</div>

					{/* Forgot password link */}
					<div className="flex justify-start pt-1">
						<Link to="/auth/forgot-password" className="text-xs sm:text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline transition">
							Forgot Password?
						</Link>
					</div>

					{/* Sign in button */}
					<button
						type="submit"
						className="w-full rounded-lg h-12 sm:h-13 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all"
						disabled={!email || !password || loading}
					>
						{loading ? "Signing in..." : "Sign In"}
					</button>

					{/* Sign up link */}
					<div className="text-center pt-2">
						<span className="text-xs sm:text-sm text-gray-400">Don't have an account? </span>
						<Link to="/auth/signup" className="text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline transition">
							Sign Up
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
