import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import {Car, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Zap} from "lucide-react";

import {login} from "../../services/authService";

export default function Login() {

	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: "", password: ""
	});

	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (event) => {

		const {name, value} = event.target;

		setFormData((previous) => ({
			...previous, [name]: value
		}));
	};

	const handleSubmit = async (event) => {

		event.preventDefault();

		try {

			setLoading(true);

			const response = await login(formData);

			const userData = response.data;

			localStorage.setItem("token", userData.token);
			localStorage.setItem("userId", userData.userId);
			localStorage.setItem("firstName", userData.firstName);
			localStorage.setItem("email", userData.email);
			localStorage.setItem("role", userData.role);

			toast.success(response.message);

			if (userData.role === "ADMIN") {
				navigate("/admin/dashboard");
			} else {
				navigate("/dashboard");
			}

		} catch (error) {

			if (
				error.response?.status === 401
			) {

				toast.error(
					"Email or password is incorrect"
				);

				return;
			}

			toast.error(
				error.response?.data?.message ||
				"Unable to sign in"
			);
		} finally {

			setLoading(false);
		}
	};

	return (<div className="min-h-screen bg-white">

		<div className="grid min-h-screen lg:grid-cols-[44%_56%]">

			{/* LEFT BRAND PANEL */}
			<section
				className="relative hidden overflow-hidden bg-slate-950 px-12 py-10 text-white lg:flex lg:flex-col">

				<div
					className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.35),transparent_35%)]"/>

				<div className="relative z-10 flex items-center gap-3">

					<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500">

						<Car size={25}/>

					</div>

					<span className="text-2xl font-bold">
                            Cab
                            <span className="text-blue-400">
                                Go
                            </span>
                        </span>

				</div>

				<div className="relative z-10 my-auto max-w-lg">

					<p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
						Ride smarter
					</p>

					<h1 className="text-5xl font-bold leading-tight">
						Reliable rides,
						<span className="block text-blue-400">
                                every time.
                            </span>
					</h1>

					<p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
						Book safe and comfortable rides in just a few clicks.
						CabGo keeps every journey simple.
					</p>

					<div className="mt-10 space-y-5">

						<div className="flex items-center gap-4">

							<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">

								<ShieldCheck size={22}/>

							</div>

							<div>

								<p className="font-semibold">
									Safe & Secure
								</p>

								<p className="text-sm text-slate-400">
									Secure account and booking experience.
								</p>

							</div>

						</div>

						<div className="flex items-center gap-4">

							<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">

								<Zap size={22}/>

							</div>

							<div>

								<p className="font-semibold">
									Quick Booking
								</p>

								<p className="text-sm text-slate-400">
									Book your cab in a few simple steps.
								</p>

							</div>

						</div>

						<div className="flex items-center gap-4">

							<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">

								<CheckCircle2 size={22}/>

							</div>

							<div>

								<p className="font-semibold">
									Transparent Pricing
								</p>

								<p className="text-sm text-slate-400">
									Distance-based fare calculation.
								</p>

							</div>

						</div>

					</div>

				</div>

				<p className="relative z-10 text-sm text-slate-500">
					© 2026 CabGo
				</p>

			</section>

			{/* RIGHT LOGIN PANEL */}
			<section className="flex items-center justify-center bg-slate-50 px-5 py-10 sm:px-10">

				<div className="w-full max-w-md">

					<div className="mb-8 lg:hidden">

						<div className="flex items-center gap-2">

							<div
								className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">

								<Car size={23}/>

							</div>

							<span className="text-2xl font-bold text-slate-900">
                                    CabGo
                                </span>

						</div>

					</div>

					<div className="mb-8">

						<p className="mb-2 text-sm font-semibold text-blue-600">
							WELCOME BACK
						</p>

						<h2 className="text-4xl font-bold tracking-tight text-slate-950">
							Sign in to CabGo
						</h2>

						<p className="mt-3 text-slate-500">
							Enter your account details to continue.
						</p>

					</div>

					<form
						onSubmit={handleSubmit}
						className="space-y-5"
					>

						<div>

							<label className="mb-2 block text-sm font-semibold text-slate-700">
								Email address
							</label>

							<div className="relative">

								<Mail
									size={19}
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
									className="h-13 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
								/>

							</div>

						</div>

						<div>

							<div className="mb-2 flex items-center justify-between">

								<label className="text-sm font-semibold text-slate-700">
									Password
								</label>

								<Link
									to="/forgot-password"
									className="text-sm font-semibold text-blue-600 hover:text-blue-700"
								>
									Forgot password?
								</Link>

							</div>

							<div className="relative">

								<LockKeyhole
									size={19}
									className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
								/>

								<input
									type={showPassword ? "text" : "password"}
									name="password"
									autoComplete="current-password"
									placeholder="Enter your password"
									value={formData.password}
									onChange={handleChange}
									required
									className="h-13 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
								/>

								<button
									type="button"
									onClick={() => setShowPassword((previous) => !previous)}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
								>
									{showPassword ? <EyeOff size={19}/> : <Eye size={19}/>}
								</button>

							</div>

						</div>

						<button
							type="submit"
							disabled={loading}
							className="flex h-13 w-full items-center justify-center rounded-xl bg-blue-600 px-5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60"
						>
							{loading ? "Signing in..." : "Sign In"}
						</button>

					</form>

					<div className="mt-8 border-t border-slate-200 pt-6 text-center">

						<p className="text-sm text-slate-500">

							New to CabGo?{" "}

							<Link
								to="/register"
								className="font-semibold text-blue-600 hover:text-blue-700"
							>
								Create an account
							</Link>

						</p>

					</div>

				</div>

			</section>

		</div>

	</div>);
}