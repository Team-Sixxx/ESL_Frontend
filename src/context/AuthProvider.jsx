import React, { createContext, useState, useContext, useEffect } from "react";
//import { authProvider } from "../services/authService";
import useAxios from "axios-hooks";
import { API_URL } from "../settings";
import { redirect } from "react-router-dom";
import { Next } from "react-bootstrap/esm/PageItem";

import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const LOGIN_URL = API_URL + "/User/profile";
  const initialUsername = localStorage.getItem("username") || null;
  const initialToken = localStorage.getItem("token") || null;
  const status = localStorage.getItem("status") || null;
  const initialRoles = JSON.parse(localStorage.getItem("roles")) || null;
  const [username, setUsername] = useState(initialUsername);
  const [roles, setUserRoles] = useState(initialRoles);
  const [token, setUserToken] = useState(initialToken);

  const [
    { data: postData, loading: postLoading, error: postError },
    executeGetProfile,
  ] = useAxios(
    {
      url: LOGIN_URL,
      method: "Get",
    },
    { manual: true }
  );

  const signIn = async () => {
    try {
      const response = await fetch(
        "https://localhost:7154/User/signin-google",
        {
          method: "Get",
          credentials: "include", // !important cookies needs to be included
        }
      );

      if (response) {
        const data = await response.json();
        let loginUrl = data.googleAuthUrl;
        //console.log(response, "response");
        //console.log(data, "data");
        if (loginUrl) {
          // Open the Google login URL in a new tab
          window.open(loginUrl, "_blank");
          localStorage.setItem("status", "loggedIn");
          setTimeout(() => {
            window.close();
          }, 100);
        } else {
          Next();
          localStorage.removeItem("status");
        }
      } else {
        console.error("Failed to get Google login URL");
        localStorage.removeItem("status");
        Next();
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      localStorage.removeItem("status");
      Next();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (status != null && username == null) {
        try {
          const response = await fetch("https://localhost:7154/User/profile", {
            method: "GET",
            credentials: "include", // Ensure cookies are included
          });

          if (response.ok) {
            const data = await response.json();
            console.log(data, "Profile data");
            setUsername(data.email);
          } else {
            console.error("Failed to fetch profile", response.status);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchData().catch(console.error);
  }, []);

  const signOut = () => {
    setUsername(null);
    console.log(isLoggedIn(), "isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
  };

  function isLoggedIn() {
    //console.log(username, "username");
    return username != null;
  }

  function isLoggedInAs(role) {
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    return roles?.some((r) => role.includes(r)) || false;
  }

  const value = {
    username,
    isLoggedIn,
    isLoggedInAs,
    signIn,
    signOut,
    roles,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
