import {useEffect, useState} from "react";
import toast from "react-hot-toast";

import {CalendarDays, CheckCircle2, CircleX, MapPin, Navigation, Route, UserRound, Wallet} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";

import {getAllTrips, updateTripStatus} from "../../services/adminService";

export default function AdminTrips() {

	const [trips, setTrips] = useState([]);
	const [loading, setLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState(null);

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

	const getStatusClass = (status) => {

		switch (status) {

			case "BOOKED":
				return "bg-blue-50 text-blue-700";

			case "COMPLETED":
				return "bg-green-50 text-green-700";

			case "CANCELLED":
				return "bg-red-50 text-red-700";

			default:
				return "bg-slate-100 text-slate-700";
		}
	};

	const formatDate = (date) => {

		if (!date) {
			return "One-way trip";
		}

		return new Date(date)
			.toLocaleString();
	};

	if (loading) {

		return (<AdminLayout>

			<div className="rounded-2xl border bg-white p-10 text-center text-slate-500 shadow-sm">
				Loading trips...
			</div>

		</AdminLayout>);
	}

	return (<AdminLayout>

		<div className="mb-8">

			<h1 className="text-3xl font-bold text-slate-900">
				Trips
			</h1>

			<p className="mt-2 text-slate-500">
				View and manage all cab bookings.
			</p>

		</div>

		<div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">

			<p className="text-sm text-slate-500">
				Total Trips
			</p>

			<p className="mt-1 text-3xl font-bold text-slate-900">
				{trips.length}
			</p>

		</div>

		{trips.length === 0 ? (

			<div className="rounded-2xl border bg-white p-12 text-center shadow-sm">

				<Route
					size={34}
					className="mx-auto text-slate-400"
				/>

				<h2 className="mt-4 text-lg font-semibold text-slate-900">
					No trips found
				</h2>

				<p className="mt-2 text-sm text-slate-500">
					Cab bookings will appear here.
				</p>

			</div>

		) : (

			<div className="space-y-5">

				{trips.map((trip) => (

					<div
						key={trip.id}
						className="rounded-2xl border bg-white p-6 shadow-sm"
					>

						<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

							<div>

								<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
									Trip #{trip.id}
								</p>

								<h2 className="mt-1 text-xl font-semibold text-slate-900">
									{trip.origin}
									{" → "}
									{trip.destination}
								</h2>

							</div>

							<span
								className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${getStatusClass(trip.status)}`}
							>
                                    {trip.status}
                                </span>

						</div>

						<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

							<div className="flex items-start gap-3">

								<UserRound
									size={20}
									className="mt-0.5 text-slate-400"
								/>

								<div>

									<p className="text-xs text-slate-400">
										User ID
									</p>

									<p className="text-sm font-medium text-slate-700">
										#{trip.userId}
									</p>

								</div>

							</div>

							<div className="flex items-start gap-3">

								<Route
									size={20}
									className="mt-0.5 text-slate-400"
								/>

								<div>

									<p className="text-xs text-slate-400">
										Distance
									</p>

									<p className="text-sm font-medium text-slate-700">
										{trip.distance} km
									</p>

								</div>

							</div>

							<div className="flex items-start gap-3">

								<Wallet
									size={20}
									className="mt-0.5 text-slate-400"
								/>

								<div>

									<p className="text-xs text-slate-400">
										Fare
									</p>

									<p className="text-sm font-medium text-slate-700">
										₹
										{Number(trip.fare).toFixed(2)}
									</p>

								</div>

							</div>

							<div className="flex items-start gap-3">

								<CalendarDays
									size={20}
									className="mt-0.5 text-slate-400"
								/>

								<div>

									<p className="text-xs text-slate-400">
										Pickup
									</p>

									<p className="text-sm font-medium text-slate-700">
										{formatDate(trip.pickupDate)}
									</p>

								</div>

							</div>

						</div>

						<div className="mt-6 grid gap-4 border-t pt-5 md:grid-cols-3">

							<div className="flex items-start gap-3">

								<MapPin
									size={20}
									className="mt-0.5 text-slate-400"
								/>

								<div>

									<p className="text-xs text-slate-400">
										Origin
									</p>

									<p className="text-sm text-slate-700">
										{trip.origin}
									</p>

								</div>

							</div>

							<div className="flex items-start gap-3">

								<Navigation
									size={20}
									className="mt-0.5 text-slate-400"
								/>

								<div>

									<p className="text-xs text-slate-400">
										Destination
									</p>

									<p className="text-sm text-slate-700">
										{trip.destination}
									</p>

								</div>

							</div>

							<div className="flex items-start gap-3">

								<CalendarDays
									size={20}
									className="mt-0.5 text-slate-400"
								/>

								<div>

									<p className="text-xs text-slate-400">
										Return
									</p>

									<p className="text-sm text-slate-700">
										{formatDate(trip.returnDate)}
									</p>

								</div>

							</div>

						</div>

						{trip.status === "BOOKED" && (

							<div className="mt-6 flex flex-wrap justify-end gap-3 border-t pt-5">

								<button
									type="button"
									disabled={updatingId === trip.id}
									onClick={() => handleStatusUpdate(trip.id, "COMPLETED")}
									className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
								>

									<CheckCircle2 size={17}/>

									{updatingId === trip.id ? "Updating..." : "Mark Completed"}

								</button>

								<button
									type="button"
									disabled={updatingId === trip.id}
									onClick={() => handleStatusUpdate(trip.id, "CANCELLED")}
									className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
								>

									<CircleX size={17}/>

									{updatingId === trip.id ? "Updating..." : "Cancel Trip"}

								</button>

							</div>)}

					</div>

				))}

			</div>)}

	</AdminLayout>);
}