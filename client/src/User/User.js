import React from "react";
import { AnimatePresence } from "framer-motion";
import Weather from "../Layout/Weather";
import Home from "./Components/Home";
import Nav from "../Layout/Nav";
import Sidebar from "../Layout/Sidebar";
import { Route, Switch } from "react-router-dom";

const User = ({ showModal, setShowModal }) => {
  return (
    <main className="container">
      <Nav />
      <Sidebar />
      <Weather />
      <Route path="/" exact render={(props) => <Home />} />
    </main>
  );
};

export default User;
