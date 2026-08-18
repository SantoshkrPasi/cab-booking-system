import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import {ArrowLeft, Car, KeyRound, LockKeyhole, Mail, ShieldCheck} from "lucide-react";

import {resetPassword, sendForgotPasswordOtp, verifyForgotPasswordOtp} from "../../services/authService";

export default function ForgotPassword() {

	const navigate = useNavigate();

	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);

	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");

	const [passwordData, setPasswordData] = useState({
		newPassword: "", confirmPassword: ""
	});

	const handleSendOtp = async (event) => {

		event.preventDefault();

		try {

			setLoading(true);

			const response = await sendForgotPasswordOtp(email);

			toast.success(response.message);

			setStep(2);

		} catch (error) {

			toast.error(error.response?.data?.message || "Unable to send OTP");

		} finally {

			setLoading(false);
		}
	};

	const handleVerifyOtp = async (event) => {

		event.preventDefault();

		try {

			setLoading(true);

			const response = await verifyForgotPasswordOtp(email, otp);

			toast.success(response.message);

			setStep(3);

		} catch (error) {

			toast.error(error.response?.data?.message || "OTP verification failed");

		} finally {

			setLoading(false);
		}
	};

	const handleResetPassword = async (event) => {

		event.preventDefault();

		if (passwordData.newPassword !== passwordData.confirmPassword) {

			toast.error("Passwords do not match");

			return;
		}

		if (passwordData.newPassword.length < 6) {

			toast.error("Password must contain at least 6 characters");

			return;
		}

		try {

			setLoading(true);

			const response = await resetPassword(email, passwordData.newPassword);

			toast.success(response.message);

			navigate("/login");

		} catch (error) {

			toast.error(error.response?.data?.message || "Unable to reset password");

		} finally {

			setLoading(false);
		}
	};

	return (<div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">

		<div className="w-full max-w-md">

			<Link
				to="/login"
				className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
			>
				<ArrowLeft size={18}/>

				Back to Login
			</Link>

			<div className="mb-6 text-center">

				<div
					className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">

					<Car size={30}/>

				</div>

				<h1 className="text-3xl font-bold text-slate-900">
					Forgot Password
				</h1>

				<p className="mt-2 text-sm text-slate-500">

					{step === 1 && "Enter your registered email address."}

					{step === 2 && "Enter the OTP sent to your email."}

					{step === 3 && "Create a new password for your account."}

				</p>

			</div>

			<div className="mb-6 flex justify-center gap-2">

				{[1, 2, 3].map((item) => (

					<div
						key={item}
						className={`h-2 rounded-full ${item === step ? "w-10 bg-slate-900" : item < step ? "w-6 bg-green-500" : "w-6 bg-slate-300"}`}
					/>

				))}

			</div>

			{step === 1 && (

				<form
					onSubmit={handleSendOtp}
					className="space-y-5 rounded-2xl border bg-white p-8 shadow-sm"
				>

					<div className="text-center">

						<Mail
							size={30}
							className="mx-auto text-slate-600"
						/>

						<h2 className="mt-3 text-xl font-semibold text-slate-900">
							Find your account
						</h2>

					</div>

					<div>

						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Email
						</label>

						<div className="relative">

							<Mail
								size={19}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							/>

							<input
								type="email"
								placeholder="Enter registered email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								required
								className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-slate-900"
							/>

						</div>

					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
					>
						{loading ? "Sending OTP..." : "Send OTP"}
					</button>

				</form>)}

			{step === 2 && (

				<form
					onSubmit={handleVerifyOtp}
					className="space-y-6 rounded-2xl border bg-white p-8 shadow-sm"
				>

					<div className="text-center">

						<ShieldCheck
							size={34}
							className="mx-auto text-slate-600"
						/>

						<h2 className="mt-3 text-xl font-semibold text-slate-900">
							Verify OTP
						</h2>

						<p className="mt-2 text-sm text-slate-500">
							OTP sent to
						</p>

						<p className="font-semibold text-slate-800">
							{email}
						</p>

					</div>

					<input
						type="text"
						inputMode="numeric"
						value={otp}
						onChange={(event) => setOtp(event.target.value
							.replace(/\D/g, ""))}
						maxLength={6}
						placeholder="Enter 6-digit OTP"
						required
						className="w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-xl tracking-[0.4em] outline-none focus:border-slate-900"
					/>

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
					>
						{loading ? "Verifying..." : "Verify OTP"}
					</button>

				</form>)}

			{step === 3 && (

				<form
					onSubmit={handleResetPassword}
					className="space-y-5 rounded-2xl border bg-white p-8 shadow-sm"
				>

					<div className="text-center">

						<KeyRound
							size={34}
							className="mx-auto text-slate-600"
						/>

						<h2 className="mt-3 text-xl font-semibold text-slate-900">
							Create New Password
						</h2>

					</div>

					<div>

						<label className="mb-2 block text-sm font-semibold text-slate-700">
							New Password
						</label>

						<div className="relative">

							<LockKeyhole
								size={19}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							/>

							<input
								type="password"
								placeholder="Enter new password"
								value={passwordData.newPassword}
								onChange={(event) => setPasswordData((previous) => ({
									...previous, newPassword: event.target.value
								}))}
								required
								className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-slate-900"
							/>

						</div>

					</div>

					<div>

						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Confirm Password
						</label>

						<div className="relative">

							<LockKeyhole
								size={19}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							/>

							<input
								type="password"
								placeholder="Confirm new password"
								value={passwordData.confirmPassword}
								onChange={(event) => setPasswordData((previous) => ({
									...previous, confirmPassword: event.target.value
								}))}
								required
								className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-slate-900"
							/>

						</div>

					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
					>
						{loading ? "Resetting Password..." : "Reset Password"}
					</button>

				</form>)}

		</div>

	</div>);
}