import {Navigate, Route, Routes} from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Dashboard from "../pages/user/Dashboard.jsx";
import BookCab from "../pages/user/BookCab.jsx";
import MyTrips from "../pages/user/MyTrips.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminUsers from "../pages/admin/AdminUsers.jsx";
import AdminTrips from "../pages/admin/AdminTrips.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword";

export default function AppRoutes() {

	return (<Routes>

		<Route
			path="/"
			element={<Navigate
				to="/login"
				replace
			/>}
		/>

		<Route
			path="/login"
			element={<Login/>}
		/>

		<Route
			path="/register"
			element={<Register/>}
		/>

		<Route
			path="/dashboard"
			element={<ProtectedRoute>
				<Dashboard/>
			</ProtectedRoute>}
		/>

		<Route
			path="/admin/dashboard"
			element={<AdminRoute>
				<AdminDashboard/>
			</AdminRoute>}
		/>
		<Route
			path="/book-cab"
			element={<ProtectedRoute>
				<BookCab/>
			</ProtectedRoute>}
		/>

		<Route
			path="/my-trips"
			element={<ProtectedRoute>
				<MyTrips/>
			</ProtectedRoute>}
		/>
		<Route
			path="/admin/users"
			element={<AdminRoute>
				<AdminUsers/>
			</AdminRoute>}
		/>

		<Route
			path="/admin/trips"
			element={<AdminRoute>
				<AdminTrips/>
			</AdminRoute>}
		/>

		<Route
			path="/forgot-password"
			element={<ForgotPassword/>}
		/>
		
	</Routes>);


}