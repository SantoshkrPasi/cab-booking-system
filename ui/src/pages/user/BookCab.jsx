import {useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import {ArrowLeft, CalendarDays, Car, Check, Clock3, MapPin, Navigation, Route, Wallet} from "lucide-react";

import UserLayout from "../../components/layout/UserLayout";
import {bookTrip} from "../../services/tripService";

export default function BookCab() {

	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		tripType: "ONE_WAY", origin: "", destination: "", pickupDate: "", pickupTime: "", returnDate: "", returnTime: ""
	});


	/*
	 * Handle normal input changes
	 */
	const handleChange = (event) => {

		const {name, value} = event.target;

		setFormData((previous) => ({
			...previous, [name]: value
		}));
	};


	/*
	 * Change trip type
	 */
	const handleTripTypeChange = (tripType) => {

		setFormData((previous) => ({
			...previous, tripType,

			/*
			 * Remove return information
			 * when switching back to One Way.
			 */
			returnDate: tripType === "ONE_WAY" ? "" : previous.returnDate,

			returnTime: tripType === "ONE_WAY" ? "" : previous.returnTime
		}));
	};


	/*
	 * Today's LOCAL date.
	 *
	 * Important:
	 * Do not directly use new Date().toISOString()
	 * because toISOString() uses UTC.
	 */
	const today = useMemo(() => {

		const now = new Date();

		const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

		return localDate
			.toISOString()
			.slice(0, 10);

	}, []);


	/*
	 * Current local time
	 */
	const currentTime = useMemo(() => {

		const now = new Date();

		return [String(now.getHours())
			.padStart(2, "0"),

			String(now.getMinutes())
				.padStart(2, "0")].join(":");

	}, []);


	/*
	 * Build pickup datetime for backend.
	 *
	 * Example:
	 * 2026-08-23T10:30
	 */
	const pickupDateTime = useMemo(() => {

		if (!formData.pickupDate || !formData.pickupTime) {
			return "";
		}

		return (`${formData.pickupDate}` + `T${formData.pickupTime}`);

	}, [formData.pickupDate, formData.pickupTime]);


	/*
	 * Build return datetime for backend
	 */
	const returnDateTime = useMemo(() => {

		if (!formData.returnDate || !formData.returnTime) {
			return "";
		}

		return (`${formData.returnDate}` + `T${formData.returnTime}`);

	}, [formData.returnDate, formData.returnTime]);


	/*
	 * Prevent selecting an old pickup time
	 * when today's date is selected.
	 */
	const pickupMinTime = formData.pickupDate === today ? currentTime : "00:00";


	/*
	 * If pickup and return are on the same day,
	 * return time cannot be before pickup.
	 */
	const returnMinTime = formData.returnDate && formData.returnDate === formData.pickupDate ? formData.pickupTime || "00:00" : "00:00";


	/*
	 * Pretty date/time for Ride Summary
	 */
	const formatSummaryDate = (date, time) => {

		if (!date || !time) {
			return "Not selected";
		}

		const dateTime = new Date(`${date}T${time}`);

		return dateTime.toLocaleString(undefined, {
			dateStyle: "medium", timeStyle: "short"
		});
	};


	/*
	 * Submit booking
	 */
	const handleSubmit = async (event) => {

		event.preventDefault();


		/*
		 * Location validation
		 */
		if (formData.origin
			.trim()
			.toLowerCase() === formData.destination
			.trim()
			.toLowerCase()) {

			toast.error("Origin and destination cannot be the same");

			return;
		}


		/*
		 * Pickup date/time required
		 */
		if (!formData.pickupDate || !formData.pickupTime) {

			toast.error("Please select pickup date and time");

			return;
		}


		/*
		 * Pickup must actually be in future
		 */
		const pickup = new Date(pickupDateTime);

		if (Number.isNaN(pickup.getTime()) || pickup <= new Date()) {

			toast.error("Pickup date and time must be in the future");

			return;
		}


		/*
		 * Round Trip validation
		 */
		if (formData.tripType === "ROUND_TRIP") {

			if (!formData.returnDate || !formData.returnTime) {

				toast.error("Please select return date and time");

				return;
			}


			const returnTrip = new Date(returnDateTime);


			if (Number.isNaN(returnTrip.getTime()) || returnTrip <= pickup) {

				toast.error("Return date and time must be after pickup");

				return;
			}
		}


		try {

			setLoading(true);


			/*
			 * Backend payload
			 *
			 * No tripType field is required because:
			 *
			 * returnDate == null
			 * means ONE WAY
			 *
			 * returnDate != null
			 * means ROUND TRIP
			 */
			const tripData = {

				origin: formData.origin.trim(),

				destination: formData.destination.trim(),

				pickupDate: pickupDateTime,

				returnDate: formData.tripType === "ROUND_TRIP" ? returnDateTime : null
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


	return (

		<UserLayout>

			<div className="mx-auto max-w-7xl">


				{/* BACK */}

				<button
					type="button"
					onClick={() => navigate("/dashboard")}
					className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
				>

					<ArrowLeft size={17}/>

					Back to Dashboard

				</button>


				{/* PAGE HEADER */}

				<div className="mb-8">

					<p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
						Plan your journey
					</p>

					<h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
						Book a Cab
					</h1>

					<p className="mt-3 max-w-2xl text-slate-500">
						Choose your trip type,
						pickup location, destination
						and preferred travel schedule.
					</p>

				</div>


				<div className="grid gap-7 xl:grid-cols-[1.3fr_0.7fr]">


					{/* BOOKING FORM */}

					<form
						onSubmit={handleSubmit}
						className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8"
					>


						{/* FORM HEADER */}

						<div className="mb-8 flex items-center gap-4">

							<div
								className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

								<Car size={24}/>

							</div>

							<div>

								<h2 className="text-xl font-bold text-slate-950">
									Ride Details
								</h2>

								<p className="mt-1 text-sm text-slate-500">
									Tell us where and
									when you want to travel.
								</p>

							</div>

						</div>


						<div className="space-y-8">


							{/* TRIP TYPE */}

							<section>

								<div className="mb-4">

									<h3 className="text-base font-bold text-slate-900">
										Choose Trip Type
									</h3>

									<p className="mt-1 text-sm text-slate-500">
										Select one-way or round-trip travel.
									</p>

								</div>


								<div className="grid gap-4 sm:grid-cols-2">


									{/* ONE WAY */}

									<button
										type="button"
										onClick={() => handleTripTypeChange("ONE_WAY")}
										className={`relative flex items-center gap-4 rounded-2xl border p-5 text-left transition ${formData.tripType === "ONE_WAY" ? "border-blue-500 bg-blue-50 shadow-sm ring-4 ring-blue-50" : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"}`}
									>

										<div
											className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition ${formData.tripType === "ONE_WAY" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
										>

											<Navigation size={21}/>

										</div>


										<div className="pr-7">

											<p className="font-bold text-slate-900">
												One Way
											</p>

											<p className="mt-1 text-xs leading-5 text-slate-500">
												Travel to your destination only.
											</p>

										</div>


										{formData.tripType === "ONE_WAY" && (

											<div
												className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">

												<Check size={14}/>

											</div>

										)}

									</button>


									{/* ROUND TRIP */}

									<button
										type="button"
										onClick={() => handleTripTypeChange("ROUND_TRIP")}
										className={`relative flex items-center gap-4 rounded-2xl border p-5 text-left transition ${formData.tripType === "ROUND_TRIP" ? "border-blue-500 bg-blue-50 shadow-sm ring-4 ring-blue-50" : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"}`}
									>

										<div
											className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition ${formData.tripType === "ROUND_TRIP" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
										>

											<Route size={21}/>

										</div>


										<div className="pr-7">

											<p className="font-bold text-slate-900">
												Round Trip
											</p>

											<p className="mt-1 text-xs leading-5 text-slate-500">
												Travel and return later.
											</p>

										</div>


										{formData.tripType === "ROUND_TRIP" && (

											<div
												className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">

												<Check size={14}/>

											</div>

										)}

									</button>

								</div>

							</section>


							{/* LOCATIONS */}

							<section>

								<div className="mb-4">

									<h3 className="text-base font-bold text-slate-900">
										Route
									</h3>

									<p className="mt-1 text-sm text-slate-500">
										Enter your pickup point and destination.
									</p>

								</div>


								<div className="space-y-5">


									{/* PICKUP LOCATION */}

									<div>

										<label className="mb-2 block text-sm font-semibold text-slate-700">
											Pickup location
										</label>

										<div className="relative">

											<MapPin
												size={19}
												className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
											/>

											<input
												type="text"
												name="origin"
												placeholder="e.g. MG Road, Bengaluru"
												value={formData.origin}
												onChange={handleChange}
												required
												className="h-13 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
											/>

										</div>

									</div>


									{/* DESTINATION */}

									<div>

										<label className="mb-2 block text-sm font-semibold text-slate-700">
											Destination
										</label>

										<div className="relative">

											<Navigation
												size={19}
												className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
											/>

											<input
												type="text"
												name="destination"
												placeholder="e.g. Hebbal, Bengaluru"
												value={formData.destination}
												onChange={handleChange}
												required
												className="h-13 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
											/>

										</div>

									</div>

								</div>

							</section>


							{/* TRAVEL SCHEDULE */}

							<section>

								<div className="mb-4">

									<h3 className="text-base font-bold text-slate-900">
										Travel Schedule
									</h3>

									<p className="mt-1 text-sm text-slate-500">

										{formData.tripType === "ROUND_TRIP" ? "Choose your departure and return schedule." : "Choose when you want your ride to start."}

									</p>

								</div>


								<div
									className={`grid gap-5 ${formData.tripType === "ROUND_TRIP" ? "lg:grid-cols-2" : "grid-cols-1"}`}
								>


									{/* PICKUP SCHEDULE */}

									<div
										className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white p-5 transition focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50">

										<div className="mb-5 flex items-center gap-3">

											<div
												className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

												<CalendarDays size={20}/>

											</div>

											<div>

												<p className="font-bold text-slate-900">
													Pickup Schedule
												</p>

												<p className="text-xs text-slate-500">
													Select departure date and time.
												</p>

											</div>

										</div>


										{/* PICKUP DATE */}

										<div>

											<label
												className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
												Pickup Date
											</label>

											<input
												type="date"
												name="pickupDate"
												min={today}
												value={formData.pickupDate}
												onChange={handleChange}
												required
												className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
											/>

										</div>


										{/* PICKUP TIME */}

										<div className="mt-4">

											<label
												className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
												Pickup Time
											</label>

											<div className="relative">

												<Clock3
													size={18}
													className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
												/>

												<input
													type="time"
													name="pickupTime"
													min={pickupMinTime}
													value={formData.pickupTime}
													onChange={handleChange}
													required
													className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
												/>

											</div>

										</div>


										{/* PICKUP PREVIEW */}

										<div className="mt-4 rounded-xl border border-blue-100 bg-white px-4 py-3">

											<p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
												Your pickup
											</p>

											<p className="mt-1 text-sm font-bold text-slate-800">

												{formatSummaryDate(formData.pickupDate, formData.pickupTime)}

											</p>

										</div>

									</div>


									{/* RETURN SCHEDULE */}

									{formData.tripType === "ROUND_TRIP" && (

										<div
											className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 transition focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50">

											<div className="mb-5 flex items-center gap-3">

												<div
													className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

													<CalendarDays size={20}/>

												</div>

												<div>

													<p className="font-bold text-slate-900">
														Return Schedule
													</p>

													<p className="text-xs text-slate-500">
														Select your return date and time.
													</p>

												</div>

											</div>


											{/* RETURN DATE */}

											<div>

												<label
													className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
													Return Date
												</label>

												<input
													type="date"
													name="returnDate"
													min={formData.pickupDate || today}
													value={formData.returnDate}
													onChange={handleChange}
													required
													className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
												/>

											</div>


											{/* RETURN TIME */}

											<div className="mt-4">

												<label
													className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
													Return Time
												</label>

												<div className="relative">

													<Clock3
														size={18}
														className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
													/>

													<input
														type="time"
														name="returnTime"
														min={returnMinTime}
														value={formData.returnTime}
														onChange={handleChange}
														disabled={!formData.returnDate}
														required={formData.tripType === "ROUND_TRIP"}
														className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
													/>

												</div>

											</div>


											{/* RETURN PREVIEW */}

											<div
												className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3">

												<p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
													Your return
												</p>

												<p className="mt-1 text-sm font-bold text-slate-800">

													{formatSummaryDate(formData.returnDate, formData.returnTime)}

												</p>

											</div>

										</div>

									)}

								</div>


								<p className="mt-4 text-xs leading-5 text-slate-400">

									{formData.tripType === "ROUND_TRIP" ? "Pickup must be in the future and return must be after pickup." : "Pickup date and time must be in the future."}

								</p>

							</section>

						</div>


						{/* ROUTE INFO */}

						<div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-4">

							<p className="text-sm leading-6 text-blue-800">
								Your exact distance and fare
								are calculated from the real
								driving route when you confirm
								your booking.
							</p>

						</div>


						{/* CONFIRM BUTTON */}

						<button
							type="submit"
							disabled={loading}
							className="mt-7 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
						>

							<Car size={19}/>

							{loading ? "Calculating route..." : formData.tripType === "ROUND_TRIP" ? "Confirm Round Trip" : "Confirm One Way Trip"}

						</button>

					</form>


					{/* RIDE SUMMARY */}

					<aside
						className="h-fit overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl shadow-slate-900/10 sm:p-7 xl:sticky xl:top-24">


						{/* SUMMARY HEADER */}

						<div className="flex items-start justify-between gap-4">

							<div>

								<p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
									Ride Summary
								</p>

								<h2 className="mt-2 text-2xl font-bold">
									Your journey
								</h2>

							</div>


							<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">

								<Car
									size={21}
									className="text-blue-300"
								/>

							</div>

						</div>


						{/* TRIP TYPE */}

						<div className="mt-6">

                            <span
	                            className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-bold text-blue-300">

                                {formData.tripType === "ROUND_TRIP" ? <Route size={14}/> : <Navigation size={14}/>}

	                            {formData.tripType === "ROUND_TRIP" ? "Round Trip" : "One Way"}

                            </span>

						</div>


						{/* ROUTE */}

						<div className="mt-8">

							<div className="flex gap-4">

								<div className="flex flex-col items-center pt-1">

									<div className="h-3 w-3 rounded-full bg-blue-400 ring-4 ring-blue-400/10"/>

									<div className="my-1 h-14 w-px bg-slate-700"/>

									<div className="h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/10"/>

								</div>


								<div className="flex-1 space-y-6">

									<div>

										<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
											Pickup
										</p>

										<p className="mt-1 min-h-6 font-semibold leading-6 text-white">

											{formData.origin || "Enter pickup location"}

										</p>

									</div>


									<div>

										<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
											Destination
										</p>

										<p className="mt-1 min-h-6 font-semibold leading-6 text-white">

											{formData.destination || "Enter destination"}

										</p>

									</div>

								</div>

							</div>

						</div>


						{/* SCHEDULE SUMMARY */}

						<div className="mt-8 space-y-3">

							<div className="rounded-2xl border border-white/5 bg-white/5 p-4">

								<div className="flex items-center gap-2">

									<CalendarDays
										size={17}
										className="text-blue-400"
									/>

									<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
										Pickup Schedule
									</p>

								</div>

								<p className="mt-2 text-sm font-semibold text-white">

									{formatSummaryDate(formData.pickupDate, formData.pickupTime)}

								</p>

							</div>


							{formData.tripType === "ROUND_TRIP" && (

								<div className="rounded-2xl border border-white/5 bg-white/5 p-4">

									<div className="flex items-center gap-2">

										<CalendarDays
											size={17}
											className="text-blue-400"
										/>

										<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
											Return Schedule
										</p>

									</div>

									<p className="mt-2 text-sm font-semibold text-white">

										{formatSummaryDate(formData.returnDate, formData.returnTime)}

									</p>

								</div>

							)}

						</div>


						{/* DISTANCE / FARE */}

						<div className="mt-5 grid grid-cols-2 gap-3">

							<div className="rounded-2xl border border-white/5 bg-white/5 p-4">

								<Route
									size={20}
									className="text-blue-400"
								/>

								<p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
									Distance
								</p>

								<p className="mt-1 text-sm font-semibold text-white">
									Calculated on booking
								</p>

							</div>


							<div className="rounded-2xl border border-white/5 bg-white/5 p-4">

								<Wallet
									size={20}
									className="text-emerald-400"
								/>

								<p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
									Fare
								</p>

								<p className="mt-1 text-sm font-semibold text-white">
									Calculated on booking
								</p>

							</div>

						</div>


						{/* SUMMARY MESSAGE */}

						<div className="mt-5 rounded-2xl border border-blue-400/10 bg-blue-400/5 p-4">

							<p className="text-xs leading-5 text-slate-400">

								{formData.tripType === "ROUND_TRIP" ? "Your booking includes both the outgoing and return journey." : "This booking is for a one-way journey only."}

							</p>

						</div>

					</aside>

				</div>

			</div>

		</UserLayout>);
}