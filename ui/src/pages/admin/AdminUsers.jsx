import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import {getAllUsers} from "../../services/adminService";

export default function AdminUsers() {

	const navigate = useNavigate();

	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {

		const loadUsers = async () => {

			try {

				const response = await getAllUsers();

				setUsers(response.data || []);

			} catch (error) {

				toast.error(error.response?.data?.message || "Unable to load users");

			} finally {

				setLoading(false);
			}
		};

		loadUsers();

	}, []);

	if (loading) {
		return <div>Loading users...</div>;
	}

	return (<div>

		<h1>
			Manage Users
		</h1>

		<button
			onClick={() => navigate("/admin/dashboard")}
		>
			Back to Dashboard
		</button>

		{users.length === 0 ? (

			<p>
				No users found.
			</p>

		) : (

			<div>

				{users.map((user) => (

					<div key={user.id}>

						<h2>
							{user.firstName}{" "}
							{user.lastName}
						</h2>

						<p>
							User ID: {user.id}
						</p>

						<p>
							Email: {user.email}
						</p>

						<p>
							Mobile: {user.mobileNo}
						</p>

						<hr/>

					</div>

				))}

			</div>)}

	</div>);
}