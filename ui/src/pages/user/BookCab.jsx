import {useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import {bookTrip} from "../../services/tripService";

export default function BookCab() {

	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		origin: "",
		destination: "",
		pickupDate: "",
		returnDate: ""
	});

	const handleChange = (event) => {

		const {name, value} = event.target;

		setFormData((previous) => ({
			...previous,
			[name]: value
		}));
	};

	const handleSubmit = async (event) => {

		event.preventDefault();

		if (
			formData.origin.trim().toLowerCase() ===
			formData.destination.trim().toLowerCase()
		) {
			toast.error(
				"Origin and destination cannot be the same"
			);

			return;
		}

		if (
			formData.returnDate &&
			formData.returnDate < formData.pickupDate
		) {
			toast.error(
				"Return date cannot be before pickup date"
			);

			return;
		}

		try {

			setLoading(true);

			const tripData = {
				origin: formData.origin,
				destination: formData.destination,
				pickupDate: formData.pickupDate,
				returnDate:
					formData.returnDate || null
			};

			const response =
				await bookTrip(tripData);

			toast.success(
				response.message
			);

			console.log(
				"Booked Trip:",
				response.data
			);

			navigate("/my-trips");

		} catch (error) {

			toast.error(
				error.response?.data?.message ||
				"Unable to book trip"
			);

		} finally {

			setLoading(false);
		}
	};

	return (
		<div>

			<h1>
				Book a Cab
			</h1>

			<form onSubmit={handleSubmit}>

				<div>

					<label>
						Pickup Location
					</label>

					<input
						type="text"
						name="origin"
						placeholder="Enter pickup location"
						value={formData.origin}
						onChange={handleChange}
						required
					/>

				</div>


				<div>

					<label>
						Destination
					</label>

					<input
						type="text"
						name="destination"
						placeholder="Enter destination"
						value={formData.destination}
						onChange={handleChange}
						required
					/>

				</div>


				<div>

					<label>
						Pickup Date
					</label>

					<input
						type="datetime-local"
						name="pickupDate"
						value={formData.pickupDate}
						onChange={handleChange}
						required
					/>

				</div>


				<div>

					<label>
						Return Date
					</label>

					<input
						type="datetime-local"
						name="returnDate"
						value={formData.returnDate}
						onChange={handleChange}
					/>

				</div>


				<button
					type="submit"
					disabled={loading}
				>

					{
						loading
							? "Booking..."
							: "Book Cab"
					}

				</button>

			</form>

			<button
				type="button"
				onClick={() =>
					navigate("/dashboard")
				}
			>
				Back to Dashboard
			</button>

		</div>
	);
}