import React, { useEffect } from "react";
import { motion } from "framer-motion";

const Login = ({ isLoggedIn, setIsLoggedIn }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email && password) {
      const userCredentials = {
        email,
        password,
      };

      const options = {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          userCredentials,
        }),
      };

      const response = await fetch(
        "http://localhost:4000/auth/register",
        options
      );
      console.log(response);
      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
      }
    } else {
      console.log("i");
    }
  };

  return (
    <motion.div exit={{ opacity: 0 }} className="login">
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="email"
          id="email"
          className="email"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          required
          type="password"
          placeholder="password"
          id="password"
          className="password"
        />
        <input type="submit" value="Submit" />
      </form>
    </motion.div>
  );
};

export default Login;
