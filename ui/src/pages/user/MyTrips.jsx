import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import {ArrowLeft, CalendarDays, Car, CircleX, MapPin, Route, Wallet} from "lucide-react";

import UserLayout from "../../components/layout/UserLayout";

import {cancelMyTrip, getMyTrips} from "../../services/tripService";

export default function MyTrips() {

	const navigate = useNavigate();

	const [trips, setTrips] = useState([]);
	const [loading, setLoading] = useState(true);
	const [cancellingId, setCancellingId] = useState(null);

	const loadTrips = async () => {

		try {

			setLoading(true);

			const response = await getMyTrips();

			setTrips(response.data || []);

		} catch (error) {

			toast.error(error.response?.data?.message || "Unable to load trips");

		} finally {

			setLoading(false);
		}
	};

	useEffect(() => {

		loadTrips();

	}, []);

	const handleCancel = async (tripId) => {

		const confirmed = window.confirm("Are you sure you want to cancel this trip?");

		if (!confirmed) {
			return;
		}

		try {

			setCancellingId(tripId);

			const response = await cancelMyTrip(tripId);

			toast.success(response.message);

			setTrips((previousTrips) => previousTrips.map((trip) => trip.id === tripId ? response.data : trip));

		} catch (error) {

			toast.error(error.response?.data?.message || "Unable to cancel trip");

		} finally {

			setCancellingId(null);
		}
	};

	const getStatusClass = (status) => {

		switch (status) {

			case "BOOKED":
				return "bg-blue-50 text-blue-700 ring-1 ring-blue-100";

			case "COMPLETED":
				return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";

			case "CANCELLED":
				return "bg-red-50 text-red-700 ring-1 ring-red-100";

			default:
				return "bg-slate-100 text-slate-700";
		}
	};

	const formatDate = (date) => {

		if (!date) {
			return "One-way trip";
		}

		return new Date(date).toLocaleString(undefined, {
			dateStyle: "medium", timeStyle: "short"
		});
	};

	return (<UserLayout>

		<div className="mx-auto max-w-6xl">

			<div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

				<div>

					<button
						type="button"
						onClick={() => navigate("/dashboard")}
						className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
					>
						<ArrowLeft size={17}/>

						Back to Dashboard
					</button>

					<p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
						Your journeys
					</p>

					<h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
						My Trips
					</h1>

					<p className="mt-3 text-slate-500">
						View upcoming rides and your previous booking history.
					</p>

				</div>

				<button
					type="button"
					onClick={() => navigate("/book-cab")}
					className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
				>
					<Car size={18}/>

					Book New Cab
				</button>

			</div>

			{loading ? (

				<div className="space-y-5">

					{[1, 2].map((item) => (

						<div
							key={item}
							className="animate-pulse rounded-3xl border border-slate-200 bg-white p-7"
						>

							<div className="h-4 w-24 rounded bg-slate-200"/>

							<div className="mt-4 h-6 w-2/3 rounded bg-slate-200"/>

							<div className="mt-6 h-24 rounded-2xl bg-slate-100"/>

						</div>

					))}

				</div>

			) : trips.length === 0 ? (

				<div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

					<div
						className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

						<Car size={30}/>

					</div>

					<h2 className="mt-6 text-xl font-bold text-slate-950">
						No trips yet
					</h2>

					<p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
						You haven't booked a cab yet. Start your first journey with CabGo.
					</p>

					<button
						onClick={() => navigate("/book-cab")}
						className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white transition hover:bg-blue-700"
					>
						<MapPin size={18}/>

						Book Your First Ride
					</button>

				</div>

			) : (

				<div className="space-y-5">

					{trips.map((trip) => (

						<article
							key={trip.id}
							className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
						>

							{/* CARD HEADER */}
							<div
								className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

								<div>

									<p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
										Trip #{trip.id}
									</p>

									<p className="mt-1 text-sm text-slate-500">
										Booked journey
									</p>

								</div>

								<span
									className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClass(trip.status)}`}
								>
                                        {trip.status}
                                    </span>

							</div>

							<div className="p-6">

								<div className="grid gap-8 lg:grid-cols-[1fr_auto]">

									{/* ROUTE */}
									<div>

										<div className="flex gap-4">

											<div className="flex flex-col items-center pt-1">

												<div
													className="h-3.5 w-3.5 rounded-full bg-blue-500 ring-4 ring-blue-50"/>

												<div className="my-1 h-16 w-px bg-slate-200"/>

												<div
													className="h-3.5 w-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50"/>

											</div>

											<div className="flex-1 space-y-7">

												<div>

													<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
														Pickup
													</p>

													<p className="mt-1 font-semibold leading-6 text-slate-900">
														{trip.origin}
													</p>

												</div>

												<div>

													<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
														Destination
													</p>

													<p className="mt-1 font-semibold leading-6 text-slate-900">
														{trip.destination}
													</p>

												</div>

											</div>

										</div>

									</div>

									{/* FARE */}
									<div className="rounded-2xl bg-slate-950 px-6 py-5 text-white lg:min-w-44">

										<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
											Total Fare
										</p>

										<p className="mt-2 text-3xl font-bold">
											₹
											{Number(trip.fare).toFixed(2)}
										</p>

										<div className="mt-4 flex items-center gap-2 text-sm text-slate-300">

											<Route
												size={16}
												className="text-blue-400"
											/>

											{trip.distance} km

										</div>

									</div>

								</div>

								{/* INFO GRID */}
								<div
									className="mt-7 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-3">

									<div className="flex items-start gap-3">

										<div
											className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

											<CalendarDays size={18}/>

										</div>

										<div>

											<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
												Pickup Time
											</p>

											<p className="mt-1 text-sm font-semibold text-slate-700">
												{formatDate(trip.pickupDate)}
											</p>

										</div>

									</div>

									<div className="flex items-start gap-3">

										<div
											className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">

											<CalendarDays size={18}/>

										</div>

										<div>

											<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
												Return
											</p>

											<p className="mt-1 text-sm font-semibold text-slate-700">
												{formatDate(trip.returnDate)}
											</p>

										</div>

									</div>

									<div className="flex items-start gap-3">

										<div
											className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

											<Wallet size={18}/>

										</div>

										<div>

											<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
												Trip Type
											</p>

											<p className="mt-1 text-sm font-semibold text-slate-700">

												{trip.returnDate ? "Round Trip" : "One Way"}

											</p>

										</div>

									</div>

								</div>

								{trip.status === "BOOKED" && (

									<div className="mt-6 flex justify-end border-t border-slate-100 pt-5">

										<button
											type="button"
											disabled={cancellingId === trip.id}
											onClick={() => handleCancel(trip.id)}
											className="inline-flex h-11 items-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
										>

											<CircleX size={17}/>

											{cancellingId === trip.id ? "Cancelling..." : "Cancel Booking"}

										</button>

									</div>

								)}

							</div>

						</article>

					))}

				</div>

			)}

		</div>

	</UserLayout>);
}