import {useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {ArrowLeft, CalendarDays, Car, MapPin, Navigation} from "lucide-react";

import UserLayout from "../../components/layout/UserLayout";
import {bookTrip} from "../../services/tripService";

export default function BookCab() {

	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		origin: "", destination: "", pickupDate: "", returnDate: ""
	});

	const handleChange = (event) => {

		const {name, value} = event.target;

		setFormData((previous) => ({
			...previous, [name]: value
		}));
	};

	const handleSubmit = async (event) => {

		event.preventDefault();

		if (formData.origin.trim().toLowerCase() === formData.destination.trim().toLowerCase()) {
			toast.error("Origin and destination cannot be the same");

			return;
		}

		if (formData.returnDate && formData.returnDate < formData.pickupDate) {
			toast.error("Return date cannot be before pickup date");

			return;
		}

		try {

			setLoading(true);

			const tripData = {
				origin: formData.origin,
				destination: formData.destination,
				pickupDate: formData.pickupDate,
				returnDate: formData.returnDate || null
			};

			const response = await bookTrip(tripData);

			toast.success(response.message);

			navigate("/my-trips");

		} catch (error) {

			toast.error(error.response?.data?.message || "Unable to book trip");

		} finally {

			setLoading(false);
		}
	};

	return (<UserLayout>

		<div className="mx-auto max-w-3xl">

			<button
				type="button"
				onClick={() => navigate("/dashboard")}
				className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
			>
				<ArrowLeft size={18}/>

				Back to Dashboard
			</button>

			<div className="mb-8">

				<div className="mb-3 flex items-center gap-3">

					<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">

						<Car size={24}/>

					</div>

					<div>

						<h1 className="text-3xl font-bold text-slate-900">
							Book a Cab
						</h1>

						<p className="text-sm text-slate-500">
							Enter your journey details below.
						</p>

					</div>

				</div>

			</div>

			<form
				onSubmit={handleSubmit}
				className="space-y-6 rounded-2xl border bg-white p-8 shadow-sm"
			>

				<div>

					<label className="mb-2 block text-sm font-semibold text-slate-700">
						Pickup Location
					</label>

					<div className="relative">

						<MapPin
							size={20}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
						/>

						<input
							type="text"
							name="origin"
							placeholder="MG Road, Bengaluru, Karnataka, India"
							value={formData.origin}
							onChange={handleChange}
							required
							className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-slate-900"
						/>

					</div>

				</div>

				<div>

					<label className="mb-2 block text-sm font-semibold text-slate-700">
						Destination
					</label>

					<div className="relative">

						<Navigation
							size={20}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
						/>

						<input
							type="text"
							name="destination"
							placeholder="Hebbal, Bengaluru, Karnataka, India"
							value={formData.destination}
							onChange={handleChange}
							required
							className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-slate-900"
						/>

					</div>

				</div>

				<div className="grid gap-6 md:grid-cols-2">

					<div>

						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Pickup Date
						</label>

						<div className="relative">

							<CalendarDays
								size={20}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							/>

							<input
								type="datetime-local"
								name="pickupDate"
								value={formData.pickupDate}
								onChange={handleChange}
								required
								className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-slate-900"
							/>

						</div>

					</div>

					<div>

						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Return Date
							<span className="ml-1 font-normal text-slate-400">
                                    (Optional)
                                </span>
						</label>

						<div className="relative">

							<CalendarDays
								size={20}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							/>

							<input
								type="datetime-local"
								name="returnDate"
								value={formData.returnDate}
								onChange={handleChange}
								className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-slate-900"
							/>

						</div>

					</div>

				</div>

				<div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">

					Distance and fare will be calculated automatically using your pickup location and destination.

				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{loading ? "Calculating & Booking..." : "Book Cab"}
				</button>

			</form>

		</div>

	</UserLayout>);
}