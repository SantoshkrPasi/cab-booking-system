import api from "./api";

export const startRegistration = async (data) => {
	const response = await api.post(
		"/auth/register",
		data
	);

	return response.data;
};

export const verifyEmailOtp = async (
	email,
	otp
) => {
	const response = await api.post(
		"/auth/register/verify-email",
		null,
		{
			params: {
				email,
				otp,
			},
		}
	);

	return response.data;
};

export const verifyMobileOtp = async (
	mobileNo,
	otp
) => {
	const response = await api.post(
		"/auth/register/verify-mobile",
		null,
		{
			params: {
				mobileNo,
				otp,
			},
		}
	);

	return response.data;
};

export const login = async (data) => {
	const response = await api.post(
		"/auth/login",
		data
	);

	return response.data;
};

export const sendForgotPasswordOtp = async (email) => {

	const response = await api.post(
		"/auth/forgot-password/send-otp",
		{
			email
		}
	);

	return response.data;
};

export const verifyForgotPasswordOtp = async (
	email,
	otp
) => {

	const response = await api.post(
		"/auth/forgot-password/verify-otp",
		{
			email,
			otp
		}
	);

	return response.data;
};

export const resetPassword = async (
	email,
	newPassword
) => {

	const response = await api.post(
		"/auth/forgot-password/reset",
		{
			email,
			newPassword
		}
	);

	return response.data;
};