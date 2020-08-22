import React from "react";

const Nav = () => {
  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-links">
          <li className="nav-link">Home</li>
          <li className="nav-link">Dashboard</li>
          <li className="nav-link">About Us</li>
          <div className="profile-picture"></div>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
