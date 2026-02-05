import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AccountMade() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");

	useEffect(() => {
		const signupEmail = sessionStorage.getItem('signupEmail');
		if (!signupEmail) {
			navigate("/auth/signup");
			return;
		}
		setEmail(signupEmail);
	}, [navigate]);

	const handleLogin = () => {
		sessionStorage.removeItem('signupEmail');
		sessionStorage.removeItem('authFlow');
		navigate("/auth/login");
	};

	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center py-8 px-4 sm:px-6 md:px-0">
			<div className="w-full sm:w-96 md:max-w-lg flex flex-col items-center justify-center">
				{/* Success icon */}
				<div className="mb-8 sm:mb-10 flex justify-center">
					<div className="w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-500">
						<div className="text-4xl sm:text-6xl md:text-8xl text-white">✓</div>
					</div>
				</div>

				{/* Main header */}
				<div className="text-center mb-4 sm:mb-6">
					<h3 className="text-2xl sm:text-3xl md:text-4xl font-bold">Account Created!</h3>
				</div>

				{/* Success message */}
				<div className="text-center mb-6 sm:mb-8">
					<p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed mb-2">
						Your account has been successfully created and your email has been verified.
					</p>
					<p className="text-xs sm:text-sm text-gray-500">
						Email: {email}
					</p>
				</div>

				{/* Login button */}
				<button
					onClick={handleLogin}
					className="w-full h-12 sm:h-13 rounded-lg text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-950 transition-all"
				>
					Go to Login
				</button>
			</div>
		</div>
	);
}
