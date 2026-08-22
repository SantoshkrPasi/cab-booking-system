import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {Car, History, LayoutDashboard, LogOut, MapPin} from "lucide-react";

export default function UserLayout({children}) {

	const navigate = useNavigate();

	const handleLogout = () => {

		localStorage.clear();

		toast.success("Logged out successfully");

		navigate("/login");
	};

	return (<div className="min-h-screen bg-slate-50">

		<header className="border-b bg-white">

			<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

				<Link
					to="/dashboard"
					className="flex items-center gap-2 text-xl font-bold"
				>
					<Car size={28}/>

					CabGo
				</Link>

				<div className="text-sm text-slate-600">
					Welcome,{" "}
					<span className="font-semibold text-slate-900">
                            {localStorage.getItem("firstName")}
                        </span>
				</div>

			</div>

		</header>

		<div className="mx-auto flex max-w-7xl">

			<aside className="min-h-[calc(100vh-65px)] w-64 border-r bg-white p-4">

				<nav className="space-y-2">

					<Link
						to="/dashboard"
						className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-100"
					>
						<LayoutDashboard size={20}/>

						Dashboard
					</Link>

					<Link
						to="/book-cab"
						className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-100"
					>
						<MapPin size={20}/>

						Book Cab
					</Link>

					<Link
						to="/my-trips"
						className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-100"
					>
						<History size={20}/>

						My Trips
					</Link>

					<button
						onClick={handleLogout}
						className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-red-600 hover:bg-red-50"
					>
						<LogOut size={20}/>

						Logout
					</button>

				</nav>

			</aside>

			<main className="flex-1 p-8">
				{children}
			</main>

		</div>

	</div>);
}