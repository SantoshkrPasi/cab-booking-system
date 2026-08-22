import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {Toaster} from "react-hot-toast";

import "./index.css";
import App from "./App";

createRoot(
	document.getElementById("root")
).render(
	<StrictMode>

		<App/>

		<Toaster
			position="top-right"
			toastOptions={{
				duration: 3500,
				style: {
					borderRadius: "12px",
					padding: "14px 16px",
					fontSize: "14px"
				}
			}}
		/>

	</StrictMode>
);