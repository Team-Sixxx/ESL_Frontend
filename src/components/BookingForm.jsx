import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TextField, Button, Box, Typography } from "@mui/material";
import useAxios from "axios-hooks";
import { useAuth } from "../context/AuthProvider.jsx";
import moment from "moment";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

function RoomBookingForm({ onClose, onSuccess, onError }) {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { username } = useAuth();
  const [selectedTime, setSelectedTime] = useState("");
  const [meetingDuration, setMeetingDuration] = useState("");

  const [value, setValue] = useState(moment());

  const [{ data: bookings, error: bookingsError }, executePost] = useAxios(
    {
      url: `https://localhost:7154/api/bookingroom`,
      method: "POST",
      withCredentials: true,
    },
    { manual: true }
  );

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

    // Calculate end time based on duration
    const endDate = value.clone().add(parseInt(meetingDuration, 10), "minutes");

    var gmtDateTime = moment.utc(value, "YYY-MM-DD HH:mm");
    var gmtDateTime2 = moment.utc(endDate, "YYY-MM-DD HH:mm");

    var local = gmtDateTime.local().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    var local2 = gmtDateTime2.local().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    const bookingData = {
      RoomId: id,
      MeetingRoomId: id,
      StartTime: local,
      EndTime: local2,
      User: username,
      isLive: false,
    };
    try {
      let response = await executePost({
        data: bookingData,
      });
      console.log(response, "response");
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error posting booking data", error.response.data.message);
      if (error.response.data.message) {
        onError(error.response.data.message);
      } else {
        onError(error);
      }
      onClose();
    }
  };

  return (
    <div>
      <header>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mt: 3 }}>
            <Typography>Enter Time:</Typography>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
                <DateTimePicker
                  label="Choose Date and Time"
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography>Enter Duration (in minutes):</Typography>
            <TextField
              label="Duration in Minutes"
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
