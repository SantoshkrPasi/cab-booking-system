import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import {login} from "../../services/authService";

export default function Login() {

	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: "", password: ""
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (event) => {

		const {name, value} = event.target;

		setFormData((previous) => ({
			...previous, [name]: value
		}));
	};

	const handleSubmit = async (event) => {

		event.preventDefault();

		try {

			setLoading(true);

			const response = await login(formData);

			const userData = response.data;

			localStorage.setItem("token", userData.token);

			localStorage.setItem("userId", userData.userId);

			localStorage.setItem("firstName", userData.firstName);

			localStorage.setItem("email", userData.email);

			localStorage.setItem("role", userData.role);

			toast.success(response.message);

			if (userData.role === "ADMIN") {

				navigate("/admin/dashboard");

			} else {

				navigate("/dashboard");
			}

		} catch (error) {

			toast.error(error.response?.data?.message || "Login failed");

		} finally {

			setLoading(false);
		}
	};

	return (<div>

		<h1>Login</h1>

		<form onSubmit={handleSubmit}>

			<input
				type="email"
				name="email"
				placeholder="Email"
				value={formData.email}
				onChange={handleChange}
				required
			/>

			<input
				type="password"
				name="password"
				placeholder="Password"
				value={formData.password}
				onChange={handleChange}
				required
			/>

			<button
				type="submit"
				disabled={loading}
			>
				{loading ? "Logging in..." : "Login"}
			</button>

		</form>

		<p>
			Don't have an account?{" "}
			<Link to="/register">
				Register
			</Link>
		</p>

	</div>);
}