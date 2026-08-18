import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

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

	if (loading) {

		return (
			<div>
				Loading trips...
			</div>
		);
	}

	return (
		<div>

			<h1>
				My Trips
			</h1>

			<button
				type="button"
				onClick={() =>
					navigate("/dashboard")
				}
			>
				Back to Dashboard
			</button>

			<button
				type="button"
				onClick={() =>
					navigate("/book-cab")
				}
			>
				Book New Cab
			</button>

			{trips.length === 0 ? (

				<div>

					<p>
						You haven't booked any trips yet.
					</p>

					<button
						onClick={() =>
							navigate("/book-cab")
						}
					>
						Book Your First Cab
					</button>

				</div>

			) : (

				<div>

					{trips.map((trip) => (

						<div
							key={trip.id}
						>

							<h2>
								{trip.origin}
								{" → "}
								{trip.destination}
							</h2>

							<p>
								Trip ID: {trip.id}
							</p>

							<p>
								Distance:{" "}
								{trip.distance} km
							</p>

							<p>
								Fare: ₹
								{Number(
									trip.fare
								).toFixed(2)}
							</p>

							<p>
								Pickup:{" "}
								{
									trip.pickupDate
								}
							</p>

							<p>
								Return:{" "}
								{
									trip.returnDate
										? trip.returnDate
										: "One-way trip"
								}
							</p>

							<p>
								Status:{" "}
								<strong>
									{trip.status}
								</strong>
							</p>

							{trip.status === "BOOKED" && (

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
								>

									{
										cancellingId === trip.id
											? "Cancelling..."
											: "Cancel Trip"
									}

								</button>
							)}

							<hr/>

						</div>

					))}

				</div>
			)}

		</div>
	);
}