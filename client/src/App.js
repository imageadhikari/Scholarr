import React, { useState } from "react";
import User from "./User/User";
import LandingPage from "./Landing Page/LandingPage";
import Login from "./Landing Page/Auth/Login";
import Register from "./Landing Page/Auth/Register";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "./Modal";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles/style.css";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<Router>
				<Modal showModal={showModal} />

				<Route
					render={({ location }) => (
						<AnimatePresence exitBeforeEnter onExitComplete={() => setShowModal(false)}>
							<Switch location={location} key={location.pathname}>
								{isLoggedIn ? (
									<>
										<User setShowModal={setShowModal} showModal={showModal} />
									</>
								) : (
									<LandingPage
										isLoggedIn={isLoggedIn}
										setIsLoggedIn={setIsLoggedIn}
										setShowModal={setShowModal}
									/>
								)}
							</Switch>
						</AnimatePresence>
					)}
				/>
			</Router>
		</>
	);
}

export default App;
