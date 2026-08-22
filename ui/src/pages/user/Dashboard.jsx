import {ArrowRight, CalendarCheck, Car, CheckCircle2, Clock3, MapPin} from "lucide-react";

import {Link} from "react-router-dom";

import UserLayout from "../../components/layout/UserLayout";

export default function Dashboard() {

	const firstName = localStorage.getItem("firstName");

	return (<UserLayout>

		<div className="space-y-8">

			{/* HERO */}

			<section
				className="overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow-xl shadow-slate-900/10 lg:p-10">

				<div className="max-w-2xl">

					<p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
						Welcome back
					</p>

					<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Where are you going today, {firstName}?
					</h1>

					<p className="mt-4 max-w-xl text-slate-300">
						Book your next ride quickly with transparent distance-based pricing.
					</p>

					<Link
						to="/book-cab"
						className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
					>
						<MapPin size={19}/>

						Book a Ride

						<ArrowRight size={18}/>

					</Link>

				</div>

			</section>

			{/* QUICK ACTIVITY */}

			<section>

				<div className="mb-4">

					<h2 className="text-xl font-bold text-slate-950">
						Quick Access
					</h2>

					<p className="mt-1 text-sm text-slate-500">
						Manage your rides from one place.
					</p>

				</div>

				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

					<Link
						to="/book-cab"
						className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
					>

						<div
							className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

							<Car size={24}/>

						</div>

						<h3 className="mt-5 text-lg font-bold text-slate-900">
							Book a Cab
						</h3>

						<p className="mt-2 text-sm leading-6 text-slate-500">
							Choose pickup, destination and travel date.
						</p>

						<div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">

							Start booking

							<ArrowRight
								size={16}
								className="transition group-hover:translate-x-1"
							/>

						</div>

					</Link>

					<Link
						to="/my-trips"
						className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
					>

						<div
							className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">

							<CalendarCheck size={24}/>

						</div>

						<h3 className="mt-5 text-lg font-bold text-slate-900">
							My Trips
						</h3>

						<p className="mt-2 text-sm leading-6 text-slate-500">
							Check upcoming and previous bookings.
						</p>

						<div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">

							View trips

							<ArrowRight
								size={16}
								className="transition group-hover:translate-x-1"
							/>

						</div>

					</Link>

					<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

						<div
							className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

							<CheckCircle2 size={24}/>

						</div>

						<h3 className="mt-5 text-lg font-bold text-slate-900">
							Simple Pricing
						</h3>

						<p className="mt-2 text-sm leading-6 text-slate-500">
							Your fare is calculated automatically from the actual route distance.
						</p>

					</div>

				</div>

			</section>

			{/* INFO */}

			<section className="grid gap-5 md:grid-cols-2">

				<div className="rounded-2xl border border-slate-200 bg-white p-6">

					<div className="flex items-center gap-3">

						<Clock3 className="text-blue-600"/>

						<h3 className="font-bold text-slate-900">
							Quick Booking
						</h3>

					</div>

					<p className="mt-3 text-sm leading-6 text-slate-500">
						Enter your locations and CabGo calculates your route and fare automatically.
					</p>

				</div>

				<div className="rounded-2xl border border-slate-200 bg-white p-6">

					<div className="flex items-center gap-3">

						<MapPin className="text-blue-600"/>

						<h3 className="font-bold text-slate-900">
							Real Route Distance
						</h3>

					</div>

					<p className="mt-3 text-sm leading-6 text-slate-500">
						Geoapify provides real driving-distance calculations for your booking.
					</p>

				</div>

			</section>

		</div>

	</UserLayout>);
}