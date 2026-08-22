import {Car, History, LayoutDashboard, LogOut, MapPin, UserRound} from "lucide-react";

import {Link, NavLink, useNavigate} from "react-router-dom";

import toast from "react-hot-toast";

export default function UserLayout({children}) {

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

	return (<div className="min-h-screen bg-[#F5F7FB]">

		<header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">

			<div className="flex h-16 items-center justify-between px-6 lg:px-8">

				<Link
					to="/dashboard"
					className="flex items-center gap-3"
				>

					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">

						<Car size={23}/>

					</div>

					<span className="text-xl font-bold text-slate-950">
                            Cab
                            <span className="text-blue-600">
                                Go
                            </span>
                        </span>

				</Link>

				<div className="flex items-center gap-3">

					<div className="hidden text-right sm:block">

						<p className="text-sm font-semibold text-slate-900">
							{firstName}
						</p>

						<p className="max-w-48 truncate text-xs text-slate-500">
							{email}
						</p>

					</div>

					<div
						className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700">

						<UserRound size={20}/>

					</div>

				</div>

			</div>

		</header>

		<div className="flex">

			<aside
				className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 bg-white p-4 md:block">

				<nav className="space-y-1">

					<NavLink
						to="/dashboard"
						className={navClass}
					>
						<LayoutDashboard size={20}/>
						Dashboard
					</NavLink>

					<NavLink
						to="/book-cab"
						className={navClass}
					>
						<MapPin size={20}/>
						Book Cab
					</NavLink>

					<NavLink
						to="/my-trips"
						className={navClass}
					>
						<History size={20}/>
						My Trips
					</NavLink>

				</nav>

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

			<main className="min-w-0 flex-1">

				<div className="mx-auto max-w-7xl p-5 sm:p-7 lg:p-8">
					{children}
				</div>

			</main>

		</div>

	</div>);
}