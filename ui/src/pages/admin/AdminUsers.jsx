import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {Mail, Phone, UserRound, Users} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";
import {getAllUsers} from "../../services/adminService";

export default function AdminUsers() {

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

		return (<AdminLayout>

			<div className="rounded-2xl border bg-white p-10 text-center text-slate-500 shadow-sm">
				Loading users...
			</div>

		</AdminLayout>);
	}

	return (<AdminLayout>

		<div className="mb-8">

			<h1 className="text-3xl font-bold text-slate-900">
				Users
			</h1>

			<p className="mt-2 text-slate-500">
				View all registered users in the CabGo platform.
			</p>

		</div>

		<div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">

			<div className="flex items-center gap-4">

				<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">

					<Users size={24}/>

				</div>

				<div>

					<p className="text-sm text-slate-500">
						Total Registered Accounts
					</p>

					<p className="text-2xl font-bold text-slate-900">
						{users.length}
					</p>

				</div>

			</div>

		</div>

		{users.length === 0 ? (

			<div className="rounded-2xl border bg-white p-12 text-center shadow-sm">

				<Users
					size={34}
					className="mx-auto text-slate-400"
				/>

				<h2 className="mt-4 text-lg font-semibold text-slate-900">
					No users found
				</h2>

				<p className="mt-2 text-sm text-slate-500">
					Registered users will appear here.
				</p>

			</div>

		) : (

			<div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

				<div className="overflow-x-auto">

					<table className="w-full text-left">

						<thead className="border-b bg-slate-50">

						<tr>

							<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
								User
							</th>

							<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
								Email
							</th>

							<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
								Mobile
							</th>

							<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
								ID
							</th>

						</tr>

						</thead>

						<tbody className="divide-y">

						{users.map((user) => (

							<tr
								key={user.id}
								className="transition hover:bg-slate-50"
							>

								<td className="px-6 py-4">

									<div className="flex items-center gap-3">

										<div
											className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">

											<UserRound
												size={20}
												className="text-slate-600"
											/>

										</div>

										<div>

											<p className="font-semibold text-slate-900">
												{user.firstName}{" "}
												{user.lastName}
											</p>

											<p className="text-xs text-slate-400">
												Registered user
											</p>

										</div>

									</div>

								</td>

								<td className="px-6 py-4">

									<div className="flex items-center gap-2 text-sm text-slate-600">

										<Mail size={17}/>

										{user.email}

									</div>

								</td>

								<td className="px-6 py-4">

									<div className="flex items-center gap-2 text-sm text-slate-600">

										<Phone size={17}/>

										{user.mobileNo}

									</div>

								</td>

								<td className="px-6 py-4">

                                            <span
	                                            className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                                                #{user.id}
                                            </span>

								</td>

							</tr>

						))}

						</tbody>

					</table>

				</div>

			</div>)}

	</AdminLayout>);
}