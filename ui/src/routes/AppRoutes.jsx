import {Navigate, Route, Routes} from "react-router-dom";
import Register from "../pages/auth/Register.jsx";
import Login from "../pages/auth/Login.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export default function AppRoutes() {
	return (
		<Routes>

			<Route
				path="/"
				element={<Navigate to="/login" replace/>}
			/>

			<Route
				path="/login"
				element={<Login/>}
			/>

			<Route
				path="/register"
				element={
					<Register/>
				}
			/>

			<Route
				path="/dashboard"
				element={
					<ProtectedRoute>
						<h1>User Dashboard</h1>
					</ProtectedRoute>
				}
			/>

			<Route
				path="/admin/dashboard"
				element={
					<ProtectedRoute>
						<h1>Admin Dashboard</h1>
					</ProtectedRoute>
				}
			/>


		</Routes>
	);
}