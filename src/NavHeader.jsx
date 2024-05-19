import { NavLink } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import { useLocation } from "react-router-dom";
//import { useAuth } from "./_Authprovider";
//import { User } from "../services/authService";
import { useState } from "react";
import "./navheader.css";

import { useNavigate } from "react-router-dom";

export default function NavHeader() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [err, setErr] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  function login() {
    //setErr(null);
    //console.log(err);
    //alert("Login: " + JSON.stringify(user));
    //return;
    auth
      .signIn()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch((err) => {
        setErr(err);
      });
  }

  return (
    <nav className="nav-header">
      <ul>
        <li>
          <h1 style={{ fontStyle: "italic", color: "black !important" }}>
            UXV Technologies Booking / ESL Test
          </h1>
        </li>
      </ul>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li></li>
        <li
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="dropdown"
        >
          <NavLink>Rooms</NavLink>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <NavLink to="/Booking">Book room</NavLink>
              <NavLink to="/meetings">See booked</NavLink>
            </div>
          )}
        </li>
        <li>
          <NavLink to="/warehouse">Warehouse</NavLink>
        </li>
      </ul>
      <ul style={{ paddingLeft: "10px" }}>
        {!auth.isLoggedIn() ? (
          <>
            <li>
              <NavLink onClick={login}>Login</NavLink>
            </li>
          </>
        ) : (
          <>
            {auth.username && <li>Logged in as {auth.username}</li>}

            <li>
              <NavLink to="/logout">Logout</NavLink>
            </li>
            <li>
              <NavLink to="/admin">Admin panel</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
