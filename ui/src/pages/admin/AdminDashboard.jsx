import {useEffect, useState} from "react";
import toast from "react-hot-toast";

import {Car, CircleCheck, CircleX, Clock3, Users, Wallet} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";
import {getAdminDashboard} from "../../services/adminService";

export default function AdminDashboard() {

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

	if (loading) {

		return (<AdminLayout>

			<div className="rounded-2xl border bg-white p-10 text-center text-slate-500 shadow-sm">
				Loading dashboard...
			</div>

		</AdminLayout>);
	}

	const cards = [

		{
			title: "Total Users", value: dashboard?.totalUsers ?? 0, icon: Users
		},

		{
			title: "Total Trips", value: dashboard?.totalTrips ?? 0, icon: Car
		},

		{
			title: "Booked Trips", value: dashboard?.bookedTrips ?? 0, icon: Clock3
		},

		{
			title: "Completed Trips", value: dashboard?.completedTrips ?? 0, icon: CircleCheck
		},

		{
			title: "Cancelled Trips", value: dashboard?.cancelledTrips ?? 0, icon: CircleX
		},

		{
			title: "Total Revenue", value: `₹${Number(dashboard?.totalRevenue ?? 0).toFixed(2)}`, icon: Wallet
		}];

	return (<AdminLayout>

		<div className="mb-8">

			<h1 className="text-3xl font-bold text-slate-900">
				Admin Dashboard
			</h1>

			<p className="mt-2 text-slate-500">
				Monitor users, trips and overall platform activity.
			</p>

		</div>

		<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

			{cards.map((card) => {

				const Icon = card.icon;

				return (

					<div
						key={card.title}
						className="rounded-2xl border bg-white p-6 shadow-sm"
					>

						<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">

							<Icon size={24}/>

						</div>

						<p className="text-sm font-medium text-slate-500">
							{card.title}
						</p>

						<p className="mt-2 text-3xl font-bold text-slate-900">
							{card.value}
						</p>

					</div>

				);

			})}

		</div>

	</AdminLayout>);
}