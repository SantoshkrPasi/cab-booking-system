import api from "./api";

export const bookTrip = async (tripData) => {

	const response = await api.post(
		"/trips",
		tripData
	);

	return response.data;
};

export const getMyTrips = async () => {

	const response = await api.get(
		"/trips/my"
	);

	return response.data;
};

export const getMyTripById = async (tripId) => {

	const response = await api.get(
		`/trips/my/${tripId}`
	);

	return response.data;
};

export const cancelMyTrip = async (tripId) => {

	const response = await api.patch(
		`/trips/my/${tripId}/cancel`
	);

	return response.data;
};