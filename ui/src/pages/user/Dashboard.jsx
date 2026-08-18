import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {

	const navigate = useNavigate();

	const firstName =
		localStorage.getItem("firstName");

	const email =
		localStorage.getItem("email");

	const handleLogout = () => {

		localStorage.clear();

		toast.success("Logged out successfully");

		navigate("/login");
	};

	return (
		<div>

			<h1>
				Welcome, {firstName}
			</h1>

			<p>
				{email}
			</p>

			<hr/>

			<div>

				<h2>
					Cab Service Dashboard
				</h2>

				<div>

					<Link to="/book-cab">
						<button>
							Book Cab
						</button>
					</Link>

					<Link to="/my-trips">
						<button>
							My Trips
						</button>
					</Link>

					<button
						onClick={handleLogout}
					>
						Logout
					</button>

				</div>

			</div>

		</div>
	);
}