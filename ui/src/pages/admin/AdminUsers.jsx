import {useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";

import {Mail, Phone, Search, ShieldCheck, UserRound, Users} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";
import {getAllUsers} from "../../services/adminService";

export default function AdminUsers() {

	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

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

	const filteredUsers = useMemo(() => {

		const searchValue = search.trim().toLowerCase();

		if (!searchValue) {
			return users;
		}

		return users.filter((user) => {

			const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`
				.toLowerCase();

			const email = (user.email ?? "")
				.toLowerCase();

			const mobile = (user.mobileNo ?? "")
				.toLowerCase();

			const role = (user.role ?? "")
				.toLowerCase();

			return (fullName.includes(searchValue) || email.includes(searchValue) || mobile.includes(searchValue) || role.includes(searchValue) || String(user.id).includes(searchValue));
		});

	}, [users, search]);

	const getRoleClass = (role) => {

		if (role === "ADMIN") {
			return "bg-violet-50 text-violet-700 ring-1 ring-violet-100";
		}

		return "bg-blue-50 text-blue-700 ring-1 ring-blue-100";
	};

	return (<AdminLayout>

		<div className="space-y-7">

			{/* HEADER */}
			<section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

				<div>

					<p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
						User Management
					</p>

					<h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
						Registered Users
					</h1>

					<p className="mt-3 text-slate-500">
						View and search all CabGo user accounts.
					</p>

				</div>

				<div
					className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm lg:max-w-sm">

					<Search
						size={18}
						className="shrink-0 text-slate-400"
					/>

					<input
						type="text"
						placeholder="Search users..."
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
					/>

				</div>

			</section>

			{/* SUMMARY */}
			<section className="grid gap-4 sm:grid-cols-2">

				<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

					<div className="flex items-center gap-4">

						<div
							className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

							<Users size={23}/>

						</div>

						<div>

							<p className="text-sm font-semibold text-slate-500">
								Total Users
							</p>

							<p className="mt-1 text-3xl font-bold text-slate-950">
								{users.length}
							</p>

						</div>

					</div>

				</div>

				<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

					<div className="flex items-center gap-4">

						<div
							className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">

							<ShieldCheck size={23}/>

						</div>

						<div>

							<p className="text-sm font-semibold text-slate-500">
								Search Results
							</p>

							<p className="mt-1 text-3xl font-bold text-slate-950">
								{filteredUsers.length}
							</p>

						</div>

					</div>

				</div>

			</section>

			{/* TABLE */}
			{loading ? (

				<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

					<div className="animate-pulse space-y-4 p-6">

						{[1, 2, 3, 4].map((item) => (

							<div
								key={item}
								className="h-16 rounded-xl bg-slate-100"
							/>

						))}

					</div>

				</div>

			) : filteredUsers.length === 0 ? (

				<div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

					<div
						className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">

						<Users size={30}/>

					</div>

					<h2 className="mt-6 text-xl font-bold text-slate-950">
						No users found
					</h2>

					<p className="mt-2 text-sm text-slate-500">

						{search ? "Try a different search term." : "Registered users will appear here."}

					</p>

				</div>

			) : (

				<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

					<div className="overflow-x-auto">

						<table className="min-w-full text-left">

							<thead className="border-b border-slate-200 bg-slate-50">

							<tr>

								<th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
									User
								</th>

								<th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
									Email
								</th>

								<th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
									Mobile
								</th>

								<th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
									Role
								</th>

								<th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
									ID
								</th>

							</tr>

							</thead>

							<tbody className="divide-y divide-slate-100">

							{filteredUsers.map((user) => (

								<tr
									key={user.id}
									className="transition hover:bg-slate-50/70"
								>

									<td className="px-6 py-5">

										<div className="flex items-center gap-3">

											<div
												className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">

												<UserRound size={20}/>

											</div>

											<div>

												<p className="font-semibold text-slate-900">
													{user.firstName}{" "}
													{user.lastName}
												</p>

												<p className="mt-0.5 text-xs text-slate-400">
													CabGo account
												</p>

											</div>

										</div>

									</td>

									<td className="px-6 py-5">

										<div className="flex items-center gap-2 text-sm text-slate-600">

											<Mail
												size={16}
												className="text-slate-400"
											/>

											{user.email}

										</div>

									</td>

									<td className="px-6 py-5">

										<div className="flex items-center gap-2 text-sm text-slate-600">

											<Phone
												size={16}
												className="text-slate-400"
											/>

											+91 {user.mobileNo}

										</div>

									</td>

									<td className="px-6 py-5">

                                                <span
	                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getRoleClass(user.role)}`}
                                                >
                                                    {user.role || "USER"}
                                                </span>

									</td>

									<td className="px-6 py-5 text-right">

                                                <span
	                                                className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
                                                    #{user.id}
                                                </span>

									</td>

								</tr>

							))}

							</tbody>

						</table>

					</div>

				</div>

			)}

		</div>

	</AdminLayout>);
}