import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {ArrowLeft, CalendarDays, Car, MapPin, Navigation, Route, Wallet} from "lucide-react";

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

			const response =
				await getMyTrips();

			setTrips(
				response.data || []
			);

		} catch (error) {

			toast.error(
				error.response?.data?.message ||
				"Unable to load trips"
			);

		} finally {

			setLoading(false);
		}
	};

	useEffect(() => {

		loadTrips();

	}, []);

	const handleCancel = async (tripId) => {

		const confirmed =
			window.confirm(
				"Are you sure you want to cancel this trip?"
			);

		if (!confirmed) {
			return;
		}

		try {

			setCancellingId(tripId);

			const response =
				await cancelMyTrip(tripId);

			toast.success(
				response.message
			);

			setTrips((previousTrips) =>
				previousTrips.map((trip) =>
					trip.id === tripId
						? response.data
						: trip
				)
			);

		} catch (error) {

			toast.error(
				error.response?.data?.message ||
				"Unable to cancel trip"
			);

		} finally {

			setCancellingId(null);
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

	return (
		<UserLayout>

			<div className="mx-auto max-w-5xl">

				<div className="mb-8 flex items-center justify-between">

					<div>

						<button
							type="button"
							onClick={() =>
								navigate("/dashboard")
							}
							className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
						>
							<ArrowLeft size={18}/>

							Back to Dashboard
						</button>

						<h1 className="text-3xl font-bold text-slate-900">
							My Trips
						</h1>

						<p className="mt-1 text-slate-500">
							View and manage your cab bookings.
						</p>

					</div>

					<button
						type="button"
						onClick={() =>
							navigate("/book-cab")
						}
						className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
					>
						Book New Cab
					</button>

				</div>

				{loading ? (

					<div className="rounded-2xl border bg-white p-10 text-center text-slate-500 shadow-sm">
						Loading trips...
					</div>

				) : trips.length === 0 ? (

					<div className="rounded-2xl border bg-white p-12 text-center shadow-sm">

						<div
							className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">

							<Car size={28}/>

						</div>

						<h2 className="text-xl font-semibold text-slate-900">
							No trips yet
						</h2>

						<p className="mt-2 text-slate-500">
							You haven't booked any cab trips yet.
						</p>

						<button
							onClick={() =>
								navigate("/book-cab")
							}
							className="mt-6 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
						>
							Book Your First Cab
						</button>

					</div>

				) : (

					<div className="space-y-5">

						{trips.map((trip) => (

							<div
								key={trip.id}
								className="rounded-2xl border bg-white p-6 shadow-sm"
							>

								<div
									className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

									<div>

										<p className="text-xs font-medium uppercase tracking-wide text-slate-400">
											Trip #{trip.id}
										</p>

										<h2 className="mt-1 text-xl font-semibold text-slate-900">
											{trip.origin}
											{" → "}
											{trip.destination}
										</h2>

									</div>

									<span
										className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${getStatusClass(
											trip.status
										)}`}
									>
                                        {trip.status}
                                    </span>

								</div>

								<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

									<div className="flex items-start gap-3">

										<MapPin
											size={20}
											className="mt-0.5 text-slate-400"
										/>

										<div>

											<p className="text-xs text-slate-400">
												Pickup
											</p>

											<p className="text-sm font-medium text-slate-700">
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

											<p className="text-sm font-medium text-slate-700">
												{trip.destination}
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
												{Number(
													trip.fare
												).toFixed(2)}
											</p>

										</div>

									</div>

								</div>

								<div className="mt-6 grid gap-4 border-t pt-5 md:grid-cols-2">

									<div className="flex items-center gap-3">

										<CalendarDays
											size={20}
											className="text-slate-400"
										/>

										<div>

											<p className="text-xs text-slate-400">
												Pickup Date
											</p>

											<p className="text-sm font-medium text-slate-700">
												{formatDate(
													trip.pickupDate
												)}
											</p>

										</div>

									</div>

									<div className="flex items-center gap-3">

										<CalendarDays
											size={20}
											className="text-slate-400"
										/>

										<div>

											<p className="text-xs text-slate-400">
												Return Date
											</p>

											<p className="text-sm font-medium text-slate-700">
												{formatDate(
													trip.returnDate
												)}
											</p>

										</div>

									</div>

								</div>

								{trip.status === "BOOKED" && (

									<div className="mt-6 flex justify-end border-t pt-5">

										<button
											type="button"
											disabled={
												cancellingId === trip.id
											}
											onClick={() =>
												handleCancel(
													trip.id
												)
											}
											className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
										>
											{
												cancellingId === trip.id
													? "Cancelling..."
													: "Cancel Trip"
											}
										</button>

									</div>
								)}

							</div>

						))}

					</div>
				)}

			</div>

		</UserLayout>
	);
}