import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import {ArrowLeft, Car, Eye, EyeOff, Mail, Phone, ShieldCheck, UserRound} from "lucide-react";

import {startRegistration, verifyEmailOtp, verifyMobileOtp} from "../../services/authService";

export default function Register() {

	const navigate = useNavigate();

	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const [formData, setFormData] = useState({
		firstName: "", lastName: "", email: "", mobileNo: "", password: ""
	});

	const [emailOtp, setEmailOtp] = useState("");
	const [mobileOtp, setMobileOtp] = useState("");

	const handleChange = (event) => {

		const {name, value} = event.target;

		setFormData((previous) => ({
			...previous, [name]: value
		}));
	};

	const handleRegistration = async (event) => {

		event.preventDefault();

		try {

			setLoading(true);

			const response = await startRegistration(formData);

			toast.success(response.message);

			setStep(2);

		} catch (error) {

			toast.error(error.response?.data?.message || "Unable to start registration");

		} finally {

			setLoading(false);
		}
	};

	const handleEmailVerification = async (event) => {

		event.preventDefault();

		try {

			setLoading(true);

			const response = await verifyEmailOtp(formData.email, emailOtp);

			toast.success(response.message);

			setStep(3);

		} catch (error) {

			toast.error(error.response?.data?.message || "Email OTP verification failed");

		} finally {

			setLoading(false);
		}
	};

	const handleMobileVerification = async (event) => {

		event.preventDefault();

		try {

			setLoading(true);

			const response = await verifyMobileOtp(formData.mobileNo, mobileOtp);

			toast.success(response.message);

			navigate("/login");

		} catch (error) {

			toast.error(error.response?.data?.message || "Mobile OTP verification failed");

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

	return (<div className="min-h-screen bg-white lg:h-screen lg:overflow-hidden">

		<div className="grid min-h-screen lg:h-screen lg:grid-cols-[42%_58%]">

			{/* LEFT BRAND SECTION */}
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
						Join CabGo
					</p>

					<h1 className="text-5xl font-bold leading-tight">
						Your next ride
						<span className="block text-blue-400">
                                starts here.
                            </span>
					</h1>

					<p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
						Create your account, verify your details,
						and start booking comfortable rides.
					</p>

					<div className="mt-10 space-y-5">

						<div className="flex items-start gap-4">

							<div
								className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
								1
							</div>

							<div>

								<p className="font-semibold">
									Create Account
								</p>

								<p className="mt-1 text-sm text-slate-400">
									Enter your basic account details.
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
									Verify Email
								</p>

								<p className="mt-1 text-sm text-slate-400">
									Secure your account using email OTP.
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
									Verify Mobile
								</p>

								<p className="mt-1 text-sm text-slate-400">
									Complete registration and start riding.
								</p>

							</div>

						</div>

					</div>

				</div>

			</section>

			{/* RIGHT FORM SECTION */}
			<section
				className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-6 sm:px-10 lg:h-screen lg:min-h-0 lg:overflow-hidden lg:py-4">
				<div className="w-full max-w-xl lg:max-h-[96vh]">

					<div className="mb-8 lg:hidden">

						<Link
							to="/login"
							className="flex items-center gap-2"
						>

							<div
								className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">

								<Car size={23}/>

							</div>

							<span className="text-2xl font-bold text-slate-900">
                                    CabGo
                                </span>

						</Link>

					</div>

					<div className="mb-4">

						<p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
							Create account
						</p>

						<h2 className="text-3xl font-bold tracking-tight text-slate-950">

							{step === 1 && "Join CabGo"}

							{step === 2 && "Verify your email"}

							{step === 3 && "Verify your mobile"}

						</h2>

						<p className="mt-2 text-sm text-slate-500">

							{step === 1 && "Enter your details to create your CabGo account."}

							{step === 2 && "Enter the 6-digit OTP sent to your email address."}

							{step === 3 && "One final verification before your account is ready."}

						</p>

					</div>

					{/* STEPPER */}
					<div className="mb-5 grid grid-cols-3">

						{[{id: 1, label: "Account"}, {id: 2, label: "Email"}, {
							id: 3, label: "Mobile"
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
									className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${getStepClass(item.id)}`}
								>
									{item.id < step ? "✓" : item.id}
								</div>

								<p className="mt-1.5 text-xs font-semibold text-slate-600">
									{item.label}
								</p>

							</div>

						))}

					</div>

					{/* STEP 1 */}
					{step === 1 && (

						<form
							onSubmit={handleRegistration}
							className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-6"
						>

							<div className="grid gap-5 sm:grid-cols-2">

								<div>

									<label className="mb-2 block text-sm font-semibold text-slate-700">
										First name
									</label>

									<div className="relative">

										<UserRound
											size={18}
											className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
										/>

										<input
											type="text"
											name="firstName"
											autoComplete="given-name"
											placeholder="Santosh"
											value={formData.firstName}
											onChange={handleChange}
											required
											className="h-13 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
										/>

									</div>

								</div>

								<div>

									<label className="mb-2 block text-sm font-semibold text-slate-700">
										Last name
									</label>

									<input
										type="text"
										name="lastName"
										autoComplete="family-name"
										placeholder="Pasi"
										value={formData.lastName}
										onChange={handleChange}
										required
										className="h-13 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
									/>

								</div>

							</div>

							<div>

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
										name="email"
										autoComplete="email"
										placeholder="name@example.com"
										value={formData.email}
										onChange={handleChange}
										required
										className="h-13 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
									/>

								</div>

							</div>

							<div>

								<label className="mb-2 block text-sm font-semibold text-slate-700">
									Mobile number
								</label>

								<div className="flex">

									<div
										className="flex h-13 items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600">
										+91
									</div>

									<div className="relative flex-1">

										<Phone
											size={18}
											className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
										/>

										<input
											type="text"
											name="mobileNo"
											inputMode="numeric"
											autoComplete="tel"
											placeholder="9876543210"
											value={formData.mobileNo}
											onChange={(event) => {

												const value = event.target.value
													.replace(/\D/g, "")
													.slice(0, 10);

												setFormData((previous) => ({
													...previous, mobileNo: value
												}));
											}}
											required
											className="h-13 w-full rounded-r-xl border border-slate-200 bg-white pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
										/>

									</div>

								</div>

							</div>

							<div>

								<label className="mb-2 block text-sm font-semibold text-slate-700">
									Password
								</label>

								<div className="relative">

									<input
										type={showPassword ? "text" : "password"}
										name="password"
										autoComplete="new-password"
										placeholder="Minimum 6 characters"
										value={formData.password}
										onChange={handleChange}
										required
										className="h-13 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
									/>

									<button
										type="button"
										onClick={() => setShowPassword((previous) => !previous)}
										className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
									>

										{showPassword ? <EyeOff size={19}/> : <Eye size={19}/>}

									</button>

								</div>

								<p className="mt-2 text-xs text-slate-400">
									Use at least 6 characters.
								</p>

							</div>

							<button
								type="submit"
								disabled={loading}
								className="flex h-13 w-full items-center justify-center rounded-xl bg-blue-600 px-5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60"
							>

								{loading ? "Creating account..." : "Continue to Verification"}

							</button>

							<p className="text-center text-sm text-slate-500">

								Already have an account?{" "}

								<Link
									to="/login"
									className="font-semibold text-blue-600 hover:text-blue-700"
								>
									Sign in
								</Link>

							</p>

						</form>

					)}

					{/* STEP 2 */}
					{step === 2 && (

						<form
							onSubmit={handleEmailVerification}
							className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5"
						>

							<div
								className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

								<Mail size={30}/>

							</div>

							<h3 className="mt-6 text-xl font-bold text-slate-950">
								Check your inbox
							</h3>

							<p className="mt-2 text-sm text-slate-500">
								We sent a 6-digit OTP to
							</p>

							<p className="mt-1 font-semibold text-slate-900">
								{formData.email}
							</p>

							<input
								type="text"
								inputMode="numeric"
								value={emailOtp}
								onChange={(event) => setEmailOtp(event.target.value
									.replace(/\D/g, "")
									.slice(0, 6))}
								maxLength={6}
								placeholder="000000"
								required
								className="mt-7 h-14 w-full rounded-xl border border-slate-200 text-center text-2xl font-bold tracking-[0.45em] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
							/>

							<button
								type="submit"
								disabled={loading || emailOtp.length !== 6}
								className="mt-5 flex h-13 w-full items-center justify-center rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
							>

								{loading ? "Verifying..." : "Verify Email"}

							</button>

							<button
								type="button"
								onClick={() => setStep(1)}
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
							onSubmit={handleMobileVerification}
							className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5"
						>

							<div
								className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">

								<ShieldCheck size={30}/>

							</div>

							<h3 className="mt-6 text-xl font-bold text-slate-950">
								Verify mobile number
							</h3>

							<p className="mt-2 text-sm text-slate-500">
								Enter the OTP for
							</p>

							<p className="mt-1 font-semibold text-slate-900">
								+91 {formData.mobileNo}
							</p>

							<div
								className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-left text-xs leading-5 text-amber-700">

								Mobile SMS delivery is currently in development mode.
								Use the OTP shown in your backend console.

							</div>

							<input
								type="text"
								inputMode="numeric"
								value={mobileOtp}
								onChange={(event) => setMobileOtp(event.target.value
									.replace(/\D/g, "")
									.slice(0, 6))}
								maxLength={6}
								placeholder="000000"
								required
								className="mt-7 h-14 w-full rounded-xl border border-slate-200 text-center text-2xl font-bold tracking-[0.45em] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
							/>

							<button
								type="submit"
								disabled={loading || mobileOtp.length !== 6}
								className="mt-5 flex h-13 w-full items-center justify-center rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
							>

								{loading ? "Completing registration..." : "Complete Registration"}

							</button>

						</form>

					)}

				</div>

			</section>

		</div>

	</div>);
}