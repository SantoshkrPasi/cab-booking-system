import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import {getAllTrips, updateTripStatus} from "../../services/adminService";

export default function AdminTrips() {

	const navigate = useNavigate();

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

	if (loading) {

		return (<div>
			Loading trips...
		</div>);
	}

	return (<div>

		<h1>
			Manage Trips
		</h1>

		<button
			type="button"
			onClick={() => navigate("/admin/dashboard")}
		>
			Back to Dashboard
		</button>

		{trips.length === 0 ? (

			<p>
				No trips found.
			</p>

		) : (

			<div>

				{trips.map((trip) => (

					<div key={trip.id}>

						<h2>
							{trip.origin}
							{" → "}
							{trip.destination}
						</h2>

						<p>
							Trip ID: {trip.id}
						</p>

						<p>
							User ID: {trip.userId}
						</p>

						<p>
							Distance: {trip.distance} km
						</p>

						<p>
							Fare: ₹
							{Number(trip.fare).toFixed(2)}
						</p>

						<p>
							Pickup:
							{" "}
							{trip.pickupDate}
						</p>

						<p>
							Return:
							{" "}
							{trip.returnDate ? trip.returnDate : "One-way trip"}
						</p>

						<p>
							Status:
							{" "}
							<strong>
								{trip.status}
							</strong>
						</p>

						{trip.status === "BOOKED" && (

							<div>

								<button
									type="button"
									disabled={updatingId === trip.id}
									onClick={() => handleStatusUpdate(trip.id, "COMPLETED")}
								>
									{updatingId === trip.id ? "Updating..." : "Mark Completed"}
								</button>

								<button
									type="button"
									disabled={updatingId === trip.id}
									onClick={() => handleStatusUpdate(trip.id, "CANCELLED")}
								>
									{updatingId === trip.id ? "Updating..." : "Cancel Trip"}
								</button>

							</div>)}

						<hr/>

					</div>

				))}

			</div>)}

	</div>);
}