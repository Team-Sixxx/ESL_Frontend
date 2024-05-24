import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/skins/dhtmlxgantt_contrast_white.css";
import useAxios from "axios-hooks";
import "./Rooms.css";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RoomBookingForm from "../components/BookingForm";
import { grey } from "@mui/material/colors";
import Alert from "@mui/material/Alert";

// Styled Dialog component
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
}));

// Dialog Title component with close button
const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

function Rooms() {
  const { id } = useParams();
  const [update, setUpdate] = useState(false);
  const [booked, setBooked] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const [
    { data: bookings, loading: bookingsLoading, error: bookingsError },
    execute,
  ] = useAxios(
    {
      url: `https://localhost:7154/api/bookingroom/${id}`,
      withCredentials: true, // credentials
    },
    { manual: true }
  );

  useEffect(() => {
    async function fetchData() {
      const response = await execute();
      if (response.data) {
        //console.log(response.data, "response.data");
        if (response.data.length > 1) {
          setBooked(response.data);
        } else {
          setBooked([response.data]);
        }
      }
    }
    fetchData();
  }, [execute, id, update]);

  useEffect(() => {
    if (booked.length > 0) {
      gantt.plugins({
        marker: true,
      });
      gantt.clearAll();
      gantt.config.duration_unit = "minute";
      gantt.config.show_markers = true;

      // unit to hours
      gantt.config.scale_unit = "hour";
      gantt.config.date_scale = "%H:%i";
      gantt.config.step = 1;
      gantt.config.subscales = [{ unit: "minute", step: 30, date: "%H:%i" }];

      // column configuration
      gantt.config.columns = [
        { name: "text", label: "Room", width: 156, tree: true, resize: true },
        {
          name: "start_date",
          label: "Start time",
          align: "center",
          width: 90,
          resize: true,
        },
        {
          name: "end_date",
          label: "End time",
          align: "center",
          width: 90,
          resize: true,
        },
        {
          name: "duration",
          label: "Duration (min)",
          align: "center",
          width: 70,
          resize: true,
        },
      ];

      gantt.init("gantt-container");

      const ganttData = booked
        .map((booking) => {
          let endDate = new Date();
          let startDate = new Date();

          if (booked.length > 1) {
            startDate = new Date(booking.startTime);
            endDate = new Date(booking.endTime);
          } else {
            startDate = Date.parse(booking.startTime);
            endDate = Date.parse(booking.endTime);
          }

          const differenceInMilliseconds = endDate - startDate;
          const differenceInMinutes = differenceInMilliseconds / 1000 / 60;

          return {
            id: booking.id,
            text: `Room ${booking.roomId} - ${booking.user}`,
            start_date: startDate,
            end_date: endDate,
            duration: differenceInMinutes,
          };
        })
        .filter((booking) => booking !== null); // Filter out invalid bookings

      var dateToStr = gantt.date.date_to_str(gantt.config.task_date);
      var markerId = gantt.addMarker({
        start_date: new Date(), // marker's date
        css: "today", // CSS class to marker
        text: "Now", // marker title
        title: dateToStr(new Date()), // marker's tooltip
      });

      gantt.parse({ data: ganttData });
      gantt.getMarker(markerId);
    }
  }, [booked, navigate]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    setOpen(false);
    setUpdate(true);
  };

  const handleBookingSuccess = () => {
    setSnackbar({
      open: true,
      message: "You successfully added a new booking!",
      severity: "success",
    });
    setUpdate((prev) => !prev); // Trigger update to refresh bookings
  };

  const handleBookingError = (error) => {
    setSnackbar({
      open: true,
      message: `Booking failed: ${error}`,
      severity: "error",
    });
  };

  const handleSnackClose = () => {
    setSnackbar({ open: false, message: "", severity: "" });
  };

  return (
    <section className="page container mt-5">
      <Snackbar
        open={snackbar.open}
        onClose={handleSnackClose}
        autoHideDuration={5000}
      >
        <Alert
          onClose={handleSnackClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Button variant="contained" onClick={handleClickOpen} className="mb-3">
        Book Room
      </Button>

      <BootstrapDialog
        maxWidth="md"
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Book a Room
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <RoomBookingForm
            onClose={handleClose}
            onSuccess={handleBookingSuccess}
            onError={handleBookingError}
          />
        </DialogContent>
      </BootstrapDialog>

      <section className="grid-container">
        <div
          id="gantt-container"
          style={{ width: "100%", height: "400px" }}
        ></div>
      </section>
    </section>
  );
}

export default Rooms;
