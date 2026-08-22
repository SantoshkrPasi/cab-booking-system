import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {Car, LockKeyhole, Mail} from "lucide-react";

import {login} from "../../services/authService";

export default function Login() {

	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: "", password: ""
	});

	const [loading, setLoading] = useState(false);

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

			toast.error(error.response?.data?.message || "Login failed");

		} finally {

			setLoading(false);
		}
	};

	return (<div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

		<div className="w-full max-w-md">

			<div className="mb-6 text-center">

				<div
					className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">

					<Car size={30}/>

				</div>

				<h1 className="text-3xl font-bold text-slate-900">
					Welcome to CabGo
				</h1>

				<p className="mt-2 text-sm text-slate-500">
					Sign in to continue your journey.
				</p>

			</div>

			<form
				onSubmit={handleSubmit}
				className="space-y-5 rounded-2xl border bg-white p-8 shadow-sm"
			>

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
							className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-slate-900"
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
							className="text-sm font-medium text-slate-600 hover:text-slate-900"
						>
							Forgot password?
						</Link>

					</div>

					<div className="relative">

						<LockKeyhole
							size={19}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
						/>

						<input
							type="password"
							name="password"
							placeholder="Enter your password"
							value={formData.password}
							onChange={handleChange}
							required
							className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-slate-900"
						/>

					</div>

				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{loading ? "Signing in..." : "Sign In"}
				</button>

				<p className="text-center text-sm text-slate-500">

					Don't have an account?{" "}

					<Link
						to="/register"
						className="font-semibold text-slate-900"
					>
						Create Account
					</Link>

				</p>

			</form>

		</div>

	</div>);
}