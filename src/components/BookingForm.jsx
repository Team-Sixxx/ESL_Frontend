import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TextField, Button, Box, Typography } from "@mui/material";
import useAxios from "axios-hooks";
import { useAuth } from "../context/AuthProvider.jsx";

function RoomBookingForm({ onClose, onSuccess }) {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { username } = useAuth();
  const [selectedTime, setSelectedTime] = useState("");
  const [meetingDuration, setMeetingDuration] = useState("");

  const [{ data: bookings, error: bookingsError }, executePost] = useAxios(
    {
      url: `https://localhost:7154/api/bookingroom`,
      method: "POST",
      withCredentials: true,
    },
    { manual: true }
  );

  console.log(username, "username");

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleDurationChange = (e) => {
    setMeetingDuration(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const bookingDate = new Date(selectedDate);
    bookingDate.setHours(hours, minutes);

    // Calculate end time based on duration
    const endDate = new Date(bookingDate);
    endDate.setMinutes(endDate.getMinutes() + parseInt(meetingDuration, 10));

    const bookingData = {
      RoomId: id,
      MeetingRoomId: id,
      StartTime: bookingDate.toISOString(), // Ensure it's in ISO format (UTC)
      EndTime: endDate.toISOString(), // Ensure it's in ISO format (UTC)
      User: username, // Replace with the actual user name if needed
      isLive: false,
    };

    try {
      await executePost({
        data: bookingData,
      });
      // handle success, maybe show a message or update state
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error posting booking data", error);
    }
  };

  return (
    <div>
      <header>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mt: 3 }}>
            <Typography>Select Date:</Typography>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              customInput={<TextField fullWidth />}
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography>Enter Time:</Typography>
            <TextField
              type="text"
              value={selectedTime}
              onChange={handleTimeChange}
              placeholder="Enter time (e.g., 09:00)"
              fullWidth
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography>Enter Duration (in minutes):</Typography>
            <TextField
              type="text"
              value={meetingDuration}
              onChange={handleDurationChange}
              placeholder="Enter duration (Minutes)"
              fullWidth
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
      </header>
    </div>
  );
}

export default RoomBookingForm;
