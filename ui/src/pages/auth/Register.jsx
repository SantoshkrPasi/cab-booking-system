import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import {Car, LockKeyhole, Mail, Phone, ShieldCheck, UserRound} from "lucide-react";

import {startRegistration, verifyEmailOtp, verifyMobileOtp} from "../../services/authService";

export default function Register() {

	const navigate = useNavigate();

	const [step, setStep] = useState(1);

	const [loading, setLoading] = useState(false);

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

	return (<div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">

		<div className="w-full max-w-md">

			<div className="mb-6 text-center">

				<div
					className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
					<Car size={30}/>
				</div>

				<h1 className="text-3xl font-bold text-slate-900">
					Create your CabGo account
				</h1>

				<p className="mt-2 text-sm text-slate-500">

					{step === 1 && "Enter your details to begin registration."}

					{step === 2 && "Verify the OTP sent to your email."}

					{step === 3 && "Verify your mobile number to complete registration."}

				</p>

			</div>

			<div className="mb-6 flex items-center justify-center gap-2">

				{[1, 2, 3].map((item) => (

					<div
						key={item}
						className={`h-2 rounded-full transition-all ${item === step ? "w-10 bg-slate-900" : item < step ? "w-6 bg-green-500" : "w-6 bg-slate-300"}`}
					/>

				))}

			</div>

			{step === 1 && (

				<form
					onSubmit={handleRegistration}
					className="space-y-5 rounded-2xl border bg-white p-8 shadow-sm"
				>

					<div className="grid gap-4 sm:grid-cols-2">

						<div>

							<label className="mb-2 block text-sm font-semibold text-slate-700">
								First Name
							</label>

							<div className="relative">

								<UserRound
									size={19}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
								/>

								<input
									type="text"
									name="firstName"
									placeholder="First name"
									value={formData.firstName}
									onChange={handleChange}
									required
									className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-slate-900"
								/>

							</div>

						</div>

						<div>

							<label className="mb-2 block text-sm font-semibold text-slate-700">
								Last Name
							</label>

							<input
								type="text"
								name="lastName"
								placeholder="Last name"
								value={formData.lastName}
								onChange={handleChange}
								required
								className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
							/>

						</div>

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
								name="email"
								placeholder="Enter your email"
								value={formData.email}
								onChange={handleChange}
								required
								className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-slate-900"
							/>

						</div>

					</div>

					<div>

						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Mobile Number
						</label>

						<div className="relative">

							<Phone
								size={19}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							/>

							<input
								type="text"
								name="mobileNo"
								placeholder="9876543210"
								value={formData.mobileNo}
								onChange={handleChange}
								maxLength={10}
								required
								className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-slate-900"
							/>

						</div>

					</div>

					<div>

						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Password
						</label>

						<div className="relative">

							<LockKeyhole
								size={19}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							/>

							<input
								type="password"
								name="password"
								placeholder="Minimum 6 characters"
								value={formData.password}
								onChange={handleChange}
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
						{loading ? "Starting Registration..." : "Continue"}
					</button>

					<p className="text-center text-sm text-slate-500">

						Already have an account?{" "}

						<Link
							to="/login"
							className="font-semibold text-slate-900"
						>
							Sign In
						</Link>

					</p>

				</form>)}

			{step === 2 && (

				<form
					onSubmit={handleEmailVerification}
					className="space-y-6 rounded-2xl border bg-white p-8 shadow-sm"
				>

					<div className="text-center">

						<div
							className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
							<Mail size={26}/>
						</div>

						<h2 className="text-xl font-semibold text-slate-900">
							Verify your email
						</h2>

						<p className="mt-2 text-sm text-slate-500">
							We sent a 6-digit OTP to
						</p>

						<p className="mt-1 font-semibold text-slate-800">
							{formData.email}
						</p>

					</div>

					<input
						type="text"
						inputMode="numeric"
						placeholder="Enter 6-digit OTP"
						value={emailOtp}
						onChange={(event) => setEmailOtp(event.target.value.replace(/\D/g, ""))}
						maxLength={6}
						required
						className="w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-xl tracking-[0.4em] outline-none focus:border-slate-900"
					/>

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
					>
						{loading ? "Verifying..." : "Verify Email"}
					</button>

				</form>)}

			{step === 3 && (

				<form
					onSubmit={handleMobileVerification}
					className="space-y-6 rounded-2xl border bg-white p-8 shadow-sm"
				>

					<div className="text-center">

						<div
							className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
							<ShieldCheck size={26}/>
						</div>

						<h2 className="text-xl font-semibold text-slate-900">
							Verify your mobile
						</h2>

						<p className="mt-2 text-sm text-slate-500">
							Enter the OTP for
						</p>

						<p className="mt-1 font-semibold text-slate-800">
							{formData.mobileNo}
						</p>

						<p className="mt-3 text-xs text-slate-400">
							For now, the mobile OTP is available in the backend console.
						</p>

					</div>

					<input
						type="text"
						inputMode="numeric"
						placeholder="Enter 6-digit OTP"
						value={mobileOtp}
						onChange={(event) => setMobileOtp(event.target.value.replace(/\D/g, ""))}
						maxLength={6}
						required
						className="w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-xl tracking-[0.4em] outline-none focus:border-slate-900"
					/>

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
					>
						{loading ? "Completing Registration..." : "Complete Registration"}
					</button>

				</form>)}

		</div>

	</div>);
}