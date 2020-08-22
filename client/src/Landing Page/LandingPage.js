import React from "react";
import Nav from "./Nav";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./Auth/Login";
import LandingHome from "./LandingHome";
import Register from "./Auth/Register";
import { Route, Switch, Redirect } from "react-router-dom";

const LandingPage = ({ isLoggedIn, setIsLoggedIn, setShowModal }) => {
  return (
    <motion.div exit={{ opacity: 0 }} class="grid">
      <Nav />

      <Switch>
        <Route path="/" exact render={(props) => <LandingHome />} />
        <Route
          path="/login"
          render={(props) => (
            <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          )}
        />
        <Route path="/register" render={(props) => <Register />} />
        {/* <Route path="/404" component={Register} /> */}
        <Redirect to="/" />
      </Switch>
    </motion.div>
  );
};

export default LandingPage;
