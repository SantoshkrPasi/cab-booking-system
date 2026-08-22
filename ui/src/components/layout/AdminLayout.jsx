import {BarChart3, Car, LayoutDashboard, LogOut, ShieldCheck, UserRound, Users} from "lucide-react";

import {Link, NavLink, useNavigate} from "react-router-dom";

import toast from "react-hot-toast";

export default function AdminLayout({children}) {

	const navigate = useNavigate();

	const firstName = localStorage.getItem("firstName");

	const email = localStorage.getItem("email");

	const handleLogout = () => {

		localStorage.clear();

		toast.success("Logged out successfully");

		navigate("/login");
	};

	const navClass = ({isActive}) => {

		return isActive ? "flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 font-semibold text-blue-700" : "flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900";
	};

	return (<div className="min-h-screen bg-slate-50">

		{/* TOP HEADER */}
		<header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

			<div className="flex h-16 items-center justify-between px-6 lg:px-8">

				<Link
					to="/admin/dashboard"
					className="flex items-center gap-3"
				>

					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">

						<ShieldCheck size={23}/>

					</div>

					<div>

						<p className="text-lg font-bold leading-none text-slate-950">
							Cab
							<span className="text-blue-600">
                                    Go
                                </span>
						</p>

						<p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
							Admin Console
						</p>

					</div>

				</Link>

				<div className="flex items-center gap-3">

					<div className="hidden text-right sm:block">

						<div className="flex items-center justify-end gap-2">

							<p className="text-sm font-semibold text-slate-900">
								{firstName}
							</p>

							<span
								className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                                    Admin
                                </span>

						</div>

						<p className="mt-0.5 max-w-48 truncate text-xs text-slate-500">
							{email}
						</p>

					</div>

					<div
						className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">

						<UserRound size={20}/>

					</div>

				</div>

			</div>

		</header>

		<div className="flex">

			{/* SIDEBAR */}
			<aside
				className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 bg-white p-4 md:block">

				<div className="mb-5 px-3">

					<p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
						Management
					</p>

				</div>

				<nav className="space-y-1">

					<NavLink
						to="/admin/dashboard"
						className={navClass}
					>
						<LayoutDashboard size={20}/>

						Overview
					</NavLink>

					<NavLink
						to="/admin/users"
						className={navClass}
					>
						<Users size={20}/>

						Users
					</NavLink>

					<NavLink
						to="/admin/trips"
						className={navClass}
					>
						<Car size={20}/>

						Trips
					</NavLink>

				</nav>

				<div className="mt-8 border-t border-slate-100 pt-5">

					<div className="rounded-2xl bg-slate-950 p-4 text-white">

						<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">

							<BarChart3 size={18}/>

						</div>

						<p className="mt-4 text-sm font-semibold">
							Operations Dashboard
						</p>

						<p className="mt-1 text-xs leading-5 text-slate-400">
							Monitor users, trips and revenue from one place.
						</p>

					</div>

				</div>

				<div className="absolute bottom-5 left-4 right-4">

					<button
						onClick={handleLogout}
						className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-red-600 transition hover:bg-red-50"
					>

						<LogOut size={20}/>

						Logout

					</button>

				</div>

			</aside>

			{/* PAGE CONTENT */}
			<main className="min-w-0 flex-1">

				<div className="mx-auto max-w-[1600px] p-5 sm:p-7 lg:p-8">

					{children}

				</div>

			</main>

		</div>

	</div>);
}