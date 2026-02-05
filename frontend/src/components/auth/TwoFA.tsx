import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { verifyEmail, verifyResetCode } from "../../services/auth/authApi";

export default function TwoFactorAuth() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [flowType, setFlowType] = useState<'signup' | 'password-reset'>('signup');

	useEffect(() => {
		const authFlow = sessionStorage.getItem('authFlow');
		const signupEmail = sessionStorage.getItem('signupEmail');
		const resetEmail = sessionStorage.getItem('resetEmail');

		if (authFlow === 'signup' && signupEmail) {
			setEmail(signupEmail);
			setFlowType('signup');
		} else if (resetEmail) {
			setEmail(resetEmail);
			setFlowType('password-reset');
		} else {
			navigate("/auth/login");
		}
	}, [navigate]);

	const handleCodeChange = (value: string) => {
		if (value.length > 6 || (value && !/^\d*$/.test(value))) return;
		setCode(value);
		setError("");
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		setSuccessMessage("");

		if (!code || code.length !== 6) {
			setError("Please enter a 6-digit code");
			return;
		}

		setLoading(true);
		try {
			if (flowType === 'signup') {
				await verifyEmail({ email, code });
				setSuccessMessage("Email verified successfully!");
				await new Promise(resolve => setTimeout(resolve, 1000));
				navigate("/auth/account-made");
			} else {
				const response = await verifyResetCode({ email, code });
				if (response.data?.resetToken) {
					sessionStorage.setItem('resetToken', response.data.resetToken);
				}
				sessionStorage.setItem('verificationCode', code);
				setSuccessMessage("Code verified successfully!");
				await new Promise(resolve => setTimeout(resolve, 1000));
				navigate("/auth/new-password");
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to verify code';
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const isCodeComplete = code.length === 6;

	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center py-8 px-4 sm:px-6 md:px-0">
			<div className="w-full sm:w-96 md:max-w-lg flex flex-col items-center justify-center">
				{/* Main header */}
				<div className="text-center mb-6 sm:mb-8">
					<h3 className="text-2xl sm:text-3xl md:text-4xl font-bold">
						{flowType === 'signup' ? 'Verify Email' : 'Verify Your Email'}
					</h3>
				</div>

				{/* Instructions */}
				<div className="text-center mb-6 sm:mb-8">
					<p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
						{flowType === 'signup' 
							? 'A 6-digit verification code has been sent to your email. Enter it below to complete your registration.'
							: 'A 6-digit verification code has been sent to your email. Enter the code below to reset your password.'}
					</p>
				</div>

				{/* Error message */}
				{error && (
					<div className="w-full bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-xs sm:text-sm mb-6 animate-pulse">
						{error}
					</div>
				)}

				{/* Success message */}
				{successMessage && (
					<div className="w-full bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-xs sm:text-sm mb-6 animate-pulse">
						{successMessage}
					</div>
				)}

				<form className="w-full space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
					{/* Email display (read-only) */}
					<div className="space-y-2">
						<label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-200">Email</label>
						<input
							id="email"
							type="email"
							value={email}
							disabled
							placeholder="Your email address"
							required
							className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500 cursor-not-allowed"
						/>
					</div>

					{/* Verification Code input */}
					<div className="space-y-2">
						<label htmlFor="code" className="block text-xs sm:text-sm font-semibold text-gray-200">Verification Code</label>
						<input
							id="code"
							type="text"
							inputMode="numeric"
							value={code}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCodeChange(e.target.value)}
							placeholder="000000"
							maxLength={6}
							required
							className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base text-center tracking-widest bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
						/>
					</div>

					{/* Verify button */}
					<button
						type="submit"
						className="w-full rounded-lg h-12 sm:h-13 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all"
						disabled={!isCodeComplete || loading}
					>
						{loading ? "Verifying..." : "Verify Code"}
					</button>
				</form>

				<div className="mt-6 pt-6 border-t border-gray-700 w-full text-center">
					<Link 
						to="/auth/login" 
						className="text-xs sm:text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 justify-center transition"
					>
						<ArrowLeft size={16} />
						Back To Login
					</Link>
				</div>
			</div>
		</div>
	);
}
