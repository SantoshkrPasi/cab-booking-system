import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:8080/api",

	headers: {
		"Content-Type": "application/json"
	}
});


/*
 * Attach JWT token to protected API requests
 */
api.interceptors.request.use(
	(config) => {

		const token =
			localStorage.getItem("token");

		if (token) {

			config.headers.Authorization =
				`Bearer ${token}`;
		}

		return config;
	},

	(error) => {

		return Promise.reject(error);
	}
);


/*
 * Handle API errors globally
 */
api.interceptors.response.use(
	(response) => {

		return response;
	},

	(error) => {

		const status =
			error.response?.status;

		const requestUrl =
			error.config?.url || "";


		/*
		 * Login can return 401 when password is wrong.
		 *
		 * In that case DO NOT redirect.
		 * Let Login.jsx show the error message.
		 */
		const isLoginRequest =
			requestUrl.includes(
				"/auth/login"
			);


		/*
		 * Only redirect to login when:
		 *
		 * - JWT is expired
		 * - JWT is invalid
		 * - protected API returns 401
		 */
		if (
			status === 401 &&
			!isLoginRequest
		) {

			localStorage.removeItem("token");
			localStorage.removeItem("userId");
			localStorage.removeItem("firstName");
			localStorage.removeItem("email");
			localStorage.removeItem("role");


			if (
				window.location.pathname !==
				"/login"
			) {

				window.location.href =
					"/login";
			}
		}


		return Promise.reject(error);
	}
);


export default api;