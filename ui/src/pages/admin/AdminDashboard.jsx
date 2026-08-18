import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import {getAdminDashboard} from "../../services/adminService";

export default function AdminDashboard() {

	const navigate = useNavigate();

	const [dashboard, setDashboard] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {

		const loadDashboard = async () => {

			try {

				const response = await getAdminDashboard();

				setDashboard(response.data);

			} catch (error) {

				toast.error(error.response?.data?.message || "Unable to load admin dashboard");

			} finally {

				setLoading(false);
			}
		};

		loadDashboard();

	}, []);

	const handleLogout = () => {

		localStorage.clear();

		toast.success("Logged out successfully");

		navigate("/login");
	};

	if (loading) {

		return (<div>
			Loading dashboard...
		</div>);
	}

	return (<div>

		<h1>
			Admin Dashboard
		</h1>

		<p>
			Welcome,{" "}
			{localStorage.getItem("firstName")}
		</p>

		<hr/>

		<div>

			<h2>
				Total Users
			</h2>

			<p>
				{dashboard?.totalUsers ?? 0}
			</p>

		</div>

		<div>

			<h2>
				Total Trips
			</h2>

			<p>
				{dashboard?.totalTrips ?? 0}
			</p>

		</div>

		<div>

			<h2>
				Booked Trips
			</h2>

			<p>
				{dashboard?.bookedTrips ?? 0}
			</p>

		</div>

		<div>

			<h2>
				Completed Trips
			</h2>

			<p>
				{dashboard?.completedTrips ?? 0}
			</p>

		</div>

		<div>

			<h2>
				Cancelled Trips
			</h2>

			<p>
				{dashboard?.cancelledTrips ?? 0}
			</p>

		</div>

		<div>

			<h2>
				Total Revenue
			</h2>

			<p>
				₹
				{Number(dashboard?.totalRevenue ?? 0).toFixed(2)}
			</p>

		</div>

		<hr/>

		<button
			onClick={() => navigate("/admin/users")}
		>
			Manage Users
		</button>

		<button
			onClick={() => navigate("/admin/trips")}
		>
			Manage Trips
		</button>

		<button
			onClick={handleLogout}
		>
			Logout
		</button>

	</div>);
}