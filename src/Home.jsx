import React, { useEffect, useState, watch } from "react";

import useAxios from "axios-hooks";
import DatePicker from "react-datepicker";
import { API_URL } from "./settings";
import { Skeleton, Button, Divider } from "@mui/material";

import "./home.css";

export default function Home() {
  const currentDate = new Date();
  const [bookingsObject, setBookings] = useState({});
  const formattedDate = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

  const [startDate, setStartDate] = useState(formattedDate);

  const SCREENINGS_URL = `${API_URL}/?Date=${encodeURIComponent(startDate)}`;

  const [{ data: bookings, loading: postLoading, error: postError }, execute] =
    useAxios();

  useEffect(() => {}, []);

  useEffect(() => {
    execute(SCREENINGS_URL);
  }, [SCREENINGS_URL]);

  function getFormattedDate() {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
  }

  return <></>;
}
