import {useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import {startRegistration, verifyEmailOtp, verifyMobileOtp} from "../../services/authService";

export default function Register() {

	const navigate = useNavigate();

	const [step, setStep] = useState(1);

	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		firstName: "", lastName: "", email: "", mobileNo: "", password: ""
	});

	const [emailOtp, setEmailOtp] = useState("");

	const [mobileOtp, setMobileOtp] = useState("");

	const handleChange = (event) => {

		const {name, value} = event.target;

		setFormData((previous) => ({
			...previous, [name]: value
		}));
	};

	const handleRegistration = async (event) => {

		event.preventDefault();

		try {

			setLoading(true);

			const response = await startRegistration(formData);

			toast.success(response.message);

			setStep(2);

		} catch (error) {

			toast.error(error.response?.data?.message || "Unable to start registration");

		} finally {

			setLoading(false);
		}
	};

	const handleEmailVerification = async (event) => {

		event.preventDefault();

		try {

			setLoading(true);

			const response = await verifyEmailOtp(formData.email, emailOtp);

			toast.success(response.message);

			setStep(3);

		} catch (error) {

			toast.error(error.response?.data?.message || "Email OTP verification failed");

		} finally {

			setLoading(false);
		}
	};

	const handleMobileVerification = async (event) => {

		event.preventDefault();

		try {

			setLoading(true);

			const response = await verifyMobileOtp(formData.mobileNo, mobileOtp);

			toast.success(response.message);

			navigate("/login");

		} catch (error) {

			toast.error(error.response?.data?.message || "Mobile OTP verification failed");

		} finally {

			setLoading(false);
		}
	};

	return (<div>

		{step === 1 && (

			<form
				onSubmit={handleRegistration}
			>

				<h1>
					Create Account
				</h1>

				<input
					type="text"
					name="firstName"
					placeholder="First Name"
					value={formData.firstName}
					onChange={handleChange}
					required
				/>

				<input
					type="text"
					name="lastName"
					placeholder="Last Name"
					value={formData.lastName}
					onChange={handleChange}
					required
				/>

				<input
					type="email"
					name="email"
					placeholder="Email"
					value={formData.email}
					onChange={handleChange}
					required
				/>

				<input
					type="text"
					name="mobileNo"
					placeholder="Mobile Number"
					value={formData.mobileNo}
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

					{loading ? "Please wait..." : "Register"}

				</button>

			</form>)}


		{step === 2 && (

			<form
				onSubmit={handleEmailVerification}
			>

				<h1>
					Verify Email
				</h1>

				<p>
					OTP sent to:
					{" "}
					{formData.email}
				</p>

				<input
					type="text"
					placeholder="Enter Email OTP"
					value={emailOtp}
					onChange={(event) => setEmailOtp(event.target.value)}
					maxLength={6}
					required
				/>

				<button
					type="submit"
					disabled={loading}
				>

					{loading ? "Verifying..." : "Verify Email"}

				</button>

			</form>)}


		{step === 3 && (

			<form
				onSubmit={handleMobileVerification}
			>

				<h1>
					Verify Mobile
				</h1>

				<p>
					OTP sent to:
					{" "}
					{formData.mobileNo}
				</p>

				<input
					type="text"
					placeholder="Enter Mobile OTP"
					value={mobileOtp}
					onChange={(event) => setMobileOtp(event.target.value)}
					maxLength={6}
					required
				/>

				<button
					type="submit"
					disabled={loading}
				>

					{loading ? "Verifying..." : "Complete Registration"}

				</button>

			</form>)}

	</div>);
}