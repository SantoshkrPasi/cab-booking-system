import api from "./api";

export const getAdminDashboard = async () => {
	const response = await api.get("/admin/dashboard");

	return response.data;
};

export const getAllUsers = async () => {
	const response = await api.get("/admin/users");

	return response.data;
};

export const getUserById = async (userId) => {
	const response = await api.get(`/admin/users/${userId}`);

	return response.data;
};

export const getAllTrips = async () => {
	const response = await api.get("/admin/trips");

	return response.data;
};

export const getTripById = async (tripId) => {
	const response = await api.get(`/admin/trips/${tripId}`);

	return response.data;
};

export const updateTripStatus = async (tripId, status) => {
	const response = await api.patch(`/admin/trips/${tripId}/status`, null, {
		params: {
			status
		}
	});

	return response.data;
};