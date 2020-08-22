import React, { useState } from "react";
import Weather from "../../Layout/Weather";
import Home from "../Home";
import Nav from "../../Layout/Nav";
import Sidebar from "../../Layout/Sidebar";
import LandingPage from "../../Landing Page/LandingPage";
import Login from "../../Landing Page/Auth/Login";
import Register from "../../Landing Page/Auth/Register";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../../../Modal";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "../../styles/style.css";

function App() {
  const [isLoggedIn, setIsLogedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Router>
        <Modal showModal={showModal} />
        {isLoggedIn ? (
          <></>
        ) : (
          <Route
            render={({ location }) => (
              <AnimatePresence
                exitBeforeEnter
                onExitComplete={() => setShowModal(false)}
              >
                <Switch location={location} key={location.pathname}>
                  <Route path="/" exact render={(props) => <LandingPage />} />
                  <Route path="/login" render={(props) => <Login />} />
                  <Route path="/login" render={(props) => <Register />} />
                </Switch>
              </AnimatePresence>
            )}
          />
        )}
      </Router>
    </>
  );
}

export default App;
