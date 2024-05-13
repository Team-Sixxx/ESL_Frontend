import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./navheader.css";

export default function NavHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="nav-header">
      <ul>
        <li>
          <h1>
            <NavLink to="/">UXV ESL</NavLink>
          </h1>
        </li>
      </ul>
      <ul>
      <li
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="dropdown"
        >
          <NavLink>Rooms</NavLink>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <NavLink to="/rooms">Book room</NavLink>
              <NavLink to="/meetings">See booked</NavLink>
              {/* Add more room links as needed */}
            </div>
          )}
        </li>

        <li>
          <NavLink to="/warehouse">Warehouse</NavLink>
        </li>

      </ul>
    </nav>
  );
}
