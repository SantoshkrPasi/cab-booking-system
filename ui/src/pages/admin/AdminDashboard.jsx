import {useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";

import {BarChart3, Car, CircleCheckBig, CircleX, Clock3, IndianRupee, TrendingUp, Users} from "lucide-react";

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

	const stats = useMemo(() => {

		return {
			totalUsers: dashboard?.totalUsers ?? 0,

			totalTrips: dashboard?.totalTrips ?? 0,

			bookedTrips: dashboard?.bookedTrips ?? 0,

			completedTrips: dashboard?.completedTrips ?? 0,

			cancelledTrips: dashboard?.cancelledTrips ?? 0,

			totalRevenue: Number(dashboard?.totalRevenue ?? 0)
		};

	}, [dashboard]);

	if (loading) {

		return (<AdminLayout>

			<div className="space-y-6">

				<div className="h-10 w-64 animate-pulse rounded-xl bg-slate-200"/>

				<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

					{[1, 2, 3, 4].map((item) => (

						<div
							key={item}
							className="h-36 animate-pulse rounded-3xl bg-slate-200"
						/>

					))}

				</div>

			</div>

		</AdminLayout>);
	}

	return (<AdminLayout>

		<div className="space-y-8">

			{/* PAGE HEADER */}
			<section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

				<div>

					<p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
						Platform Overview
					</p>

					<h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
						Admin Dashboard
					</h1>

					<p className="mt-3 text-slate-500">
						Monitor CabGo activity, users, trips and revenue.
					</p>

				</div>

				<div
					className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">

					<BarChart3 size={17}/>

					Live Overview

				</div>

			</section>

			{/* TOP KPIs */}
			<section className="grid gap-5 xl:grid-cols-[1.4fr_1fr_1fr]">

				{/* REVENUE HERO */}
				<div
					className="overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl shadow-slate-900/10">

					<div className="flex items-start justify-between">

						<div>

							<p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
								Total Revenue
							</p>

							<p className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">

								₹
								{stats.totalRevenue.toFixed(2)}

							</p>

							<p className="mt-3 text-sm text-slate-400">
								Revenue from completed trips.
							</p>

						</div>

						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">

							<IndianRupee size={24}/>

						</div>

					</div>

					<div className="mt-8 flex items-center gap-2 text-sm text-emerald-400">

						<TrendingUp size={17}/>

						Based on completed bookings

					</div>

				</div>

				{/* USERS */}
				<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

					<div className="flex items-center justify-between">

						<div
							className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

							<Users size={23}/>

						</div>

						<span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                                USERS
                            </span>

					</div>

					<p className="mt-6 text-sm font-semibold text-slate-500">
						Total Users
					</p>

					<p className="mt-1 text-4xl font-bold text-slate-950">
						{stats.totalUsers}
					</p>

				</div>

				{/* TRIPS */}
				<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

					<div className="flex items-center justify-between">

						<div
							className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">

							<Car size={23}/>

						</div>

						<span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                                TRIPS
                            </span>

					</div>

					<p className="mt-6 text-sm font-semibold text-slate-500">
						Total Trips
					</p>

					<p className="mt-1 text-4xl font-bold text-slate-950">
						{stats.totalTrips}
					</p>

				</div>

			</section>

			{/* STATUS KPIs */}
			<section>

				<div className="mb-4">

					<h2 className="text-xl font-bold text-slate-950">
						Trip Status
					</h2>

					<p className="mt-1 text-sm text-slate-500">
						Current distribution of all CabGo trips.
					</p>

				</div>

				<div className="grid gap-5 md:grid-cols-3">

					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

						<div className="flex items-center justify-between">

							<div
								className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">

								<Clock3 size={21}/>

							</div>

							<span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                                    BOOKED
                                </span>

						</div>

						<p className="mt-5 text-3xl font-bold text-slate-950">
							{stats.bookedTrips}
						</p>

						<p className="mt-1 text-sm text-slate-500">
							Waiting to be completed or cancelled.
						</p>

					</div>

					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

						<div className="flex items-center justify-between">

							<div
								className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

								<CircleCheckBig size={21}/>

							</div>

							<span
								className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                    COMPLETED
                                </span>

						</div>

						<p className="mt-5 text-3xl font-bold text-slate-950">
							{stats.completedTrips}
						</p>

						<p className="mt-1 text-sm text-slate-500">
							Successfully completed journeys.
						</p>

					</div>

					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

						<div className="flex items-center justify-between">

							<div
								className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">

								<CircleX size={21}/>

							</div>

							<span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                                    CANCELLED
                                </span>

						</div>

						<p className="mt-5 text-3xl font-bold text-slate-950">
							{stats.cancelledTrips}
						</p>

						<p className="mt-1 text-sm text-slate-500">
							Cancelled CabGo bookings.
						</p>

					</div>

				</div>

			</section>

			{/* SUMMARY PANEL */}
			<section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

				<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

					<div>

						<p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
							Operations Summary
						</p>

						<h2 className="mt-2 text-2xl font-bold text-slate-950">
							CabGo at a glance
						</h2>

						<p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
							This dashboard summarizes the current platform activity using live data from the
							backend.
						</p>

					</div>

					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

						<div className="rounded-2xl bg-slate-50 px-5 py-4">

							<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
								Completion
							</p>

							<p className="mt-1 text-xl font-bold text-slate-900">

								{stats.totalTrips > 0 ? `${Math.round((stats.completedTrips / stats.totalTrips) * 100)}%` : "0%"}

							</p>

						</div>

						<div className="rounded-2xl bg-slate-50 px-5 py-4">

							<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
								Active
							</p>

							<p className="mt-1 text-xl font-bold text-slate-900">
								{stats.bookedTrips}
							</p>

						</div>

						<div className="rounded-2xl bg-slate-50 px-5 py-4">

							<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
								Users
							</p>

							<p className="mt-1 text-xl font-bold text-slate-900">
								{stats.totalUsers}
							</p>

						</div>

					</div>

				</div>

			</section>

		</div>

	</AdminLayout>);
}