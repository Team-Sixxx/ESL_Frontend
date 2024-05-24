import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useLocation } from "react-router-dom";
//import { useAuth } from "./_Authprovider";
//import { User } from "../services/authService";
import { useState } from "react";

import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

export default function NavHeader() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [err, setErr] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function login() {
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography
            variant="h6"
            color="inherit"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            <h1 style={{ fontStyle: "italic", color: "white" }}>
              UXV Technologies Booking
            </h1>
          </Typography>
          <Button color="inherit" component={NavLink} to="/">
            Home
          </Button>

          <Menu
            id="rooms-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && isDropdownOpen}
            onClose={handleClose}
            MenuListProps={{
              onMouseEnter: handleMouseEnter,
              onMouseLeave: handleMouseLeave,
            }}
          >
            <MenuItem component={NavLink} to="/Booking" onClick={handleClose}>
              Book room
            </MenuItem>
            <MenuItem component={NavLink} to="/meetings" onClick={handleClose}>
              See booked
            </MenuItem>
          </Menu>

          {!auth.isLoggedIn() ? (
            <Button color="inherit" onClick={login}>
              Login
            </Button>
          ) : (
            <>
              {auth.username && (
                <Typography variant="body1" color="inherit">
                  Logged in as {auth.username}
                </Typography>
              )}
              <Button color="inherit" component={NavLink} to="/logout">
                Logout
              </Button>
              <Button color="inherit" component={NavLink} to="/admin">
                Admin panel (Coming soon)
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
