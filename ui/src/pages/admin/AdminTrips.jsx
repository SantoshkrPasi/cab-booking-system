import {useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";

import {CalendarDays, CheckCircle2, CircleX, MapPin, Navigation, Route, Search, UserRound, Wallet} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";

import {getAllTrips, updateTripStatus} from "../../services/adminService";

export default function AdminTrips() {

	const [trips, setTrips] = useState([]);
	const [loading, setLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState(null);

	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("ALL");

	/*
	 * Load all trips
	 */
	const loadTrips = async () => {

		try {

			setLoading(true);

			const response = await getAllTrips();

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

	/*
	 * Search + status filter
	 */
	const filteredTrips = useMemo(() => {

		const searchValue = search.trim().toLowerCase();

		return trips.filter((trip) => {

			const matchesStatus = statusFilter === "ALL" || trip.status === statusFilter;

			const searchable = [trip.id, trip.userId, trip.origin, trip.destination, trip.status]
				.join(" ")
				.toLowerCase();

			const matchesSearch = !searchValue || searchable.includes(searchValue);

			return (matchesStatus && matchesSearch);
		});

	}, [trips, search, statusFilter]);

	/*
	 * Admin updates trip status
	 */
	const handleStatusUpdate = async (tripId, status) => {

		try {

			setUpdatingId(tripId);

			const response = await updateTripStatus(tripId, status);

			toast.success(response.message);

			setTrips((previousTrips) => previousTrips.map((trip) => trip.id === tripId ? response.data : trip));

		} catch (error) {

			toast.error(error.response?.data?.message || "Unable to update trip status");

		} finally {

			setUpdatingId(null);
		}
	};

	/*
	 * Status badge styling
	 */
	const getStatusClass = (status) => {

		switch (status) {

			case "BOOKED":
				return ("bg-amber-50 " + "text-amber-700 " + "ring-1 ring-amber-100");

			case "COMPLETED":
				return ("bg-emerald-50 " + "text-emerald-700 " + "ring-1 ring-emerald-100");

			case "CANCELLED":
				return ("bg-red-50 " + "text-red-700 " + "ring-1 ring-red-100");

			default:
				return ("bg-slate-100 " + "text-slate-700");
		}
	};

	/*
	 * Format date/time
	 */
	const formatDate = (date) => {

		if (!date) {
			return "One Way";
		}

		return new Date(date)
			.toLocaleString(undefined, {
				dateStyle: "medium", timeStyle: "short"
			});
	};

	/*
	 * Status counts
	 */
	const statusCounts = {

		all: trips.length,

		booked: trips.filter((trip) => trip.status === "BOOKED").length,

		completed: trips.filter((trip) => trip.status === "COMPLETED").length,

		cancelled: trips.filter((trip) => trip.status === "CANCELLED").length
	};

	/*
	 * Filter buttons
	 */
	const filterButtons = [

		{
			label: "All", value: "ALL", count: statusCounts.all
		},

		{
			label: "Booked", value: "BOOKED", count: statusCounts.booked
		},

		{
			label: "Completed", value: "COMPLETED", count: statusCounts.completed
		},

		{
			label: "Cancelled", value: "CANCELLED", count: statusCounts.cancelled
		}];

	return (

		<AdminLayout>

			<div className="space-y-7">

				{/* HEADER */}
				<section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

					<div>

						<p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
							Trip Management
						</p>

						<h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
							All Trips
						</h1>

						<p className="mt-3 max-w-xl text-slate-500">
							Monitor every CabGo booking and manage trip status.
						</p>

					</div>

					{/* SEARCH */}
					<div
						className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm xl:max-w-sm">

						<Search
							size={18}
							className="shrink-0 text-slate-400"
						/>

						<input
							type="text"
							placeholder="Search trip, user or route..."
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
						/>

					</div>

				</section>

				{/* STATUS FILTERS */}
				<section className="flex flex-wrap gap-3">

					{filterButtons.map((filter) => {

						const active = statusFilter === filter.value;

						return (

							<button
								key={filter.value}
								type="button"
								onClick={() => setStatusFilter(filter.value)}
								className={active ? "inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm" : "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"}
							>

								{filter.label}

								<span
									className={active ? "rounded-full bg-white/15 px-2 py-0.5 text-xs" : "rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500"}
								>
                                    {filter.count}
                                </span>

							</button>

						);

					})}

				</section>

				{/* LOADING */}
				{loading ? (

					<div className="space-y-5">

						{[1, 2, 3].map((item) => (

							<div
								key={item}
								className="h-56 animate-pulse rounded-3xl bg-slate-200"
							/>

						))}

					</div>

				) : filteredTrips.length === 0 ? (

					/* EMPTY STATE */
					<div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

						<div
							className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">

							<Route size={30}/>

						</div>

						<h2 className="mt-6 text-xl font-bold text-slate-950">
							No trips found
						</h2>

						<p className="mt-2 text-sm text-slate-500">

							{search || statusFilter !== "ALL" ? "Try changing your filters or search term." : "CabGo bookings will appear here."}

						</p>

					</div>

				) : (

					/* TRIPS */
					<div className="space-y-5">

						{filteredTrips.map((trip) => (

							<article
								key={trip.id}
								className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
							>

								{/* TOP BAR */}
								<div
									className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">

									<div className="flex items-center gap-4">

										<div
											className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">

											<Route size={20}/>

										</div>

										<div>

											<div className="flex flex-wrap items-center gap-3">

												<h2 className="font-bold text-slate-950">
													Trip #{trip.id}
												</h2>

												<span
													className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(trip.status)}`}
												>
                                                    {trip.status}
                                                </span>

											</div>

											<div className="mt-1 flex items-center gap-2 text-sm text-slate-500">

												<UserRound size={15}/>

												User #{trip.userId}

											</div>

										</div>

									</div>

									{/* FARE */}
									<div className="flex items-center gap-2">

										<Wallet
											size={17}
											className="text-slate-400"
										/>

										<span className="text-sm text-slate-500">
                                            Fare
                                        </span>

										<span className="text-lg font-bold text-slate-950">

                                            ₹
											{Number(trip.fare).toFixed(2)}

                                        </span>

									</div>

								</div>

								<div className="p-6">

									<div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">

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

													{/* PICKUP */}
													<div>

														<p className="text-xs font-bold uppercase tracking-wide text-slate-400">
															Pickup
														</p>

														<div className="mt-1 flex items-start gap-2">

															<MapPin
																size={16}
																className="mt-1 shrink-0 text-blue-500"
															/>

															<p className="font-semibold leading-6 text-slate-900">
																{trip.origin}
															</p>

														</div>

													</div>

													{/* DESTINATION */}
													<div>

														<p className="text-xs font-bold uppercase tracking-wide text-slate-400">
															Destination
														</p>

														<div className="mt-1 flex items-start gap-2">

															<Navigation
																size={16}
																className="mt-1 shrink-0 text-emerald-500"
															/>

															<p className="font-semibold leading-6 text-slate-900">
																{trip.destination}
															</p>

														</div>

													</div>

												</div>

											</div>

										</div>

										{/* TRIP DETAILS */}
										<div className="grid gap-3 sm:grid-cols-2">

											{/* DISTANCE */}
											<div className="rounded-2xl bg-slate-50 p-4">

												<Route
													size={18}
													className="text-blue-600"
												/>

												<p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
													Distance
												</p>

												<p className="mt-1 font-bold text-slate-900">
													{trip.distance} km
												</p>

											</div>

											{/* PICKUP TIME */}
											<div className="rounded-2xl bg-slate-50 p-4">

												<CalendarDays
													size={18}
													className="text-violet-600"
												/>

												<p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
													Pickup Time
												</p>

												<p className="mt-1 text-sm font-semibold leading-5 text-slate-900">

													{formatDate(trip.pickupDate)}

												</p>

											</div>

											{/* RETURN */}
											<div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">

												<CalendarDays
													size={18}
													className="text-emerald-600"
												/>

												<p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
													Return
												</p>

												<p className="mt-1 text-sm font-semibold text-slate-900">

													{formatDate(trip.returnDate)}

												</p>

											</div>

										</div>

									</div>

									{/* ADMIN ACTIONS */}
									{trip.status === "BOOKED" && (

										<div
											className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

											{/* CANCEL */}
											<button
												type="button"
												disabled={updatingId === trip.id}
												onClick={() => handleStatusUpdate(trip.id, "CANCELLED")}
												className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
											>

												<CircleX size={17}/>

												{updatingId === trip.id ? "Updating..." : "Cancel Trip"}

											</button>

											{/* COMPLETE */}
											<button
												type="button"
												disabled={updatingId === trip.id}
												onClick={() => handleStatusUpdate(trip.id, "COMPLETED")}
												className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
											>

												<CheckCircle2 size={17}/>

												{updatingId === trip.id ? "Updating..." : "Mark Completed"}

											</button>

										</div>

									)}

								</div>

							</article>

						))}

					</div>

				)}

			</div>

		</AdminLayout>

	);
}