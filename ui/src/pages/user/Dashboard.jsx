import {Link} from "react-router-dom";
import {Car, History, MapPin} from "lucide-react";

import UserLayout from "../../components/layout/UserLayout";

export default function Dashboard() {

	const firstName =
		localStorage.getItem("firstName");

	return (
		<UserLayout>

			<div className="mb-8">

				<h1 className="text-3xl font-bold text-slate-900">
					Welcome back, {firstName}
				</h1>

				<p className="mt-2 text-slate-600">
					Where would you like to go today?
				</p>

			</div>

			<div className="grid gap-6 md:grid-cols-2">

				<Link
					to="/book-cab"
					className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
				>

					<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">

						<MapPin size={24}/>

					</div>

					<h2 className="text-xl font-semibold">
						Book a Cab
					</h2>

					<p className="mt-2 text-sm text-slate-600">
						Enter your pickup location and destination to book your next ride.
					</p>

				</Link>

				<Link
					to="/my-trips"
					className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
				>

					<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">

						<History size={24}/>

					</div>

					<h2 className="text-xl font-semibold">
						My Trips
					</h2>

					<p className="mt-2 text-sm text-slate-600">
						View your current and previous cab bookings.
					</p>

				</Link>

			</div>

			<div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

				<div className="flex items-center gap-3">

					<Car size={26}/>

					<div>

						<h2 className="font-semibold">
							CabGo
						</h2>

						<p className="text-sm text-slate-500">
							Simple, secure and convenient cab booking.
						</p>

					</div>

				</div>

			</div>

		</UserLayout>
	);
}