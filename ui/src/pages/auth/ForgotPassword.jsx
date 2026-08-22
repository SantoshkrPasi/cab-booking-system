import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import {ArrowLeft, Car, Eye, EyeOff, KeyRound, LockKeyhole, Mail, ShieldCheck} from "lucide-react";

import {resetPassword, sendForgotPasswordOtp, verifyForgotPasswordOtp} from "../../services/authService";

export default function ForgotPassword() {

	const navigate = useNavigate();

	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);

	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");

	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

			toast.error("Password must be at least 6 characters");

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

	const getStepClass = (currentStep) => {

		if (currentStep < step) {
			return "bg-emerald-500 text-white";
		}

		if (currentStep === step) {
			return "bg-blue-600 text-white";
		}

		return "bg-slate-200 text-slate-500";
	};

	return (<div className="min-h-screen bg-white">

		<div className="grid min-h-screen lg:grid-cols-[42%_58%]">

			{/* LEFT BRAND PANEL */}
			<section
				className="relative hidden overflow-hidden bg-slate-950 px-12 py-10 text-white lg:flex lg:flex-col">

				<div
					className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.35),transparent_35%)]"/>

				<Link
					to="/login"
					className="relative z-10 flex items-center gap-3"
				>

					<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500">

						<Car size={25}/>

					</div>

					<span className="text-2xl font-bold text-white">

                            Cab

                            <span className="text-blue-400">
                                Go
                            </span>

                        </span>

				</Link>

				<div className="relative z-10 my-auto max-w-lg">

					<p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
						Account Recovery
					</p>

					<h1 className="text-5xl font-bold leading-tight">

						Get back on the road

						<span className="block text-blue-400">
                                securely.
                            </span>

					</h1>

					<p className="mt-6 max-w-md text-lg leading-8 text-slate-300">

						Reset your password using a secure email OTP
						and regain access to your CabGo account.

					</p>

					<div className="mt-10 space-y-5">

						<div className="flex items-start gap-4">

							<div
								className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
								1
							</div>

							<div>

								<p className="font-semibold">
									Enter Email
								</p>

								<p className="mt-1 text-sm text-slate-400">
									Use your registered CabGo email.
								</p>

							</div>

						</div>

						<div className="flex items-start gap-4">

							<div
								className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
								2
							</div>

							<div>

								<p className="font-semibold">
									Verify OTP
								</p>

								<p className="mt-1 text-sm text-slate-400">
									Confirm the code sent to your inbox.
								</p>

							</div>

						</div>

						<div className="flex items-start gap-4">

							<div
								className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
								3
							</div>

							<div>

								<p className="font-semibold">
									New Password
								</p>

								<p className="mt-1 text-sm text-slate-400">
									Set a fresh password and sign in again.
								</p>

							</div>

						</div>

					</div>

				</div>

			</section>

			{/* RIGHT PANEL */}
			<section className="flex items-center justify-center bg-slate-50 px-5 py-10 sm:px-10">

				<div className="w-full max-w-lg">

					<div className="mb-8">

						<Link
							to="/login"
							className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
						>

							<ArrowLeft size={17}/>

							Back to Login

						</Link>

						<p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
							Forgot Password
						</p>

						<h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">

							{step === 1 && "Find your account"}

							{step === 2 && "Verify your identity"}

							{step === 3 && "Create a new password"}

						</h2>

						<p className="mt-3 text-slate-500">

							{step === 1 && "Enter your registered email address."}

							{step === 2 && "Enter the 6-digit code sent to your inbox."}

							{step === 3 && "Choose a new password for your CabGo account."}

						</p>

					</div>

					{/* STEPPER */}
					<div className="mb-8 grid grid-cols-3">

						{[{id: 1, label: "Email"}, {id: 2, label: "Verify"}, {
							id: 3, label: "Password"
						}].map((item, index) => (

							<div
								key={item.id}
								className="relative flex flex-col items-center"
							>

								{index !== 0 && (

									<div
										className={`absolute right-1/2 top-5 h-0.5 w-full ${item.id <= step ? "bg-blue-600" : "bg-slate-200"}`}
									/>

								)}

								<div
									className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${getStepClass(item.id)}`}
								>

									{item.id < step ? "✓" : item.id}

								</div>

								<p className="mt-2 text-xs font-semibold text-slate-600">
									{item.label}
								</p>

							</div>

						))}

					</div>

					{/* STEP 1 */}
					{step === 1 && (

						<form
							onSubmit={handleSendOtp}
							className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5"
						>

							<div
								className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

								<Mail size={27}/>

							</div>

							<h3 className="mt-5 text-xl font-bold text-slate-950">
								Enter your email
							</h3>

							<p className="mt-2 text-sm leading-6 text-slate-500">
								We'll send a verification code to your registered email address.
							</p>

							<div className="mt-6">

								<label className="mb-2 block text-sm font-semibold text-slate-700">
									Email address
								</label>

								<div className="relative">

									<Mail
										size={18}
										className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
									/>

									<input
										type="email"
										autoComplete="email"
										placeholder="name@example.com"
										value={email}
										onChange={(event) => setEmail(event.target.value)}
										required
										className="h-13 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
									/>

								</div>

							</div>

							<button
								type="submit"
								disabled={loading}
								className="mt-6 flex h-13 w-full items-center justify-center rounded-xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60"
							>

								{loading ? "Sending OTP..." : "Send Verification Code"}

							</button>

						</form>

					)}

					{/* STEP 2 */}
					{step === 2 && (

						<form
							onSubmit={handleVerifyOtp}
							className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5"
						>

							<div
								className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

								<ShieldCheck size={30}/>

							</div>

							<h3 className="mt-6 text-xl font-bold text-slate-950">
								Check your inbox
							</h3>

							<p className="mt-2 text-sm text-slate-500">
								We sent a 6-digit code to
							</p>

							<p className="mt-1 font-semibold text-slate-900">
								{email}
							</p>

							<input
								type="text"
								inputMode="numeric"
								value={otp}
								onChange={(event) => setOtp(event.target.value
									.replace(/\D/g, "")
									.slice(0, 6))}
								maxLength={6}
								placeholder="000000"
								required
								className="mt-7 h-14 w-full rounded-xl border border-slate-200 text-center text-2xl font-bold tracking-[0.45em] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
							/>

							<button
								type="submit"
								disabled={loading || otp.length !== 6}
								className="mt-5 flex h-13 w-full items-center justify-center rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
							>

								{loading ? "Verifying..." : "Verify Code"}

							</button>

							<button
								type="button"
								onClick={() => {
									setOtp("");
									setStep(1);
								}}
								className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
							>

								<ArrowLeft size={16}/>

								Change email

							</button>

						</form>

					)}

					{/* STEP 3 */}
					{step === 3 && (

						<form
							onSubmit={handleResetPassword}
							className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5"
						>

							<div
								className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">

								<KeyRound size={27}/>

							</div>

							<h3 className="mt-5 text-xl font-bold text-slate-950">
								Set a new password
							</h3>

							<p className="mt-2 text-sm leading-6 text-slate-500">
								Your new password must contain at least 6 characters.
							</p>

							<div className="mt-6">

								<label className="mb-2 block text-sm font-semibold text-slate-700">
									New password
								</label>

								<div className="relative">

									<LockKeyhole
										size={18}
										className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
									/>

									<input
										type={showNewPassword ? "text" : "password"}
										autoComplete="new-password"
										placeholder="Enter new password"
										value={passwordData.newPassword}
										onChange={(event) => setPasswordData((previous) => ({
											...previous, newPassword: event.target.value
										}))}
										required
										className="h-13 w-full rounded-xl border border-slate-200 pl-12 pr-12 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
									/>

									<button
										type="button"
										onClick={() => setShowNewPassword((previous) => !previous)}
										className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
									>

										{showNewPassword ? <EyeOff size={19}/> : <Eye size={19}/>}

									</button>

								</div>

							</div>

							<div className="mt-5">

								<label className="mb-2 block text-sm font-semibold text-slate-700">
									Confirm password
								</label>

								<div className="relative">

									<LockKeyhole
										size={18}
										className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
									/>

									<input
										type={showConfirmPassword ? "text" : "password"}
										autoComplete="new-password"
										placeholder="Confirm new password"
										value={passwordData.confirmPassword}
										onChange={(event) => setPasswordData((previous) => ({
											...previous, confirmPassword: event.target.value
										}))}
										required
										className="h-13 w-full rounded-xl border border-slate-200 pl-12 pr-12 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
									/>

									<button
										type="button"
										onClick={() => setShowConfirmPassword((previous) => !previous)}
										className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
									>

										{showConfirmPassword ? <EyeOff size={19}/> : <Eye size={19}/>}

									</button>

								</div>

							</div>

							<button
								type="submit"
								disabled={loading}
								className="mt-6 flex h-13 w-full items-center justify-center rounded-xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60"
							>

								{loading ? "Resetting password..." : "Reset Password"}

							</button>

						</form>

					)}

				</div>

			</section>

		</div>

	</div>);
}