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

  const [booked, setBooked] = useState([]);
  const [open, setOpen] = useState(false);
  const [setSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const [
    { data: bookings, loading: bookingsLoading, error: bookingsError },
    execute,
  ] = useAxios(
    {
      url: `https://localhost:7154/api/bookingroom/${id}`,
      withCredentials: true, // Make sure credentials are included if needed
    },
    { manual: true }
  );

  useEffect(() => {
    async function fetchData() {
      const response = await execute();
      if (response.data) {
        console.log(response.data, "response.data");

        if (response.data.length > 1) {
          setBooked(response.data);
        } else {
          setBooked([response.data]);
        }
      }
    }
    fetchData();
  }, [execute, id]);

  useEffect(() => {
    if (booked.length > 0) {
      gantt.plugins({
        marker: true,
      });
      gantt.clearAll();
      gantt.config.duration_unit = "minute";
      gantt.config.show_markers = true;

      // Set scale unit to hours
      gantt.config.scale_unit = "hour";
      gantt.config.date_scale = "%H:%i";
      gantt.config.step = 1; // 1-hour steps
      gantt.config.subscales = [{ unit: "minute", step: 30, date: "%H:%i" }];

      // Update column configuration
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
          const startDate = new Date(booking.startTime);
          const endDate = new Date(booking.endTime);

          // Validate dates
          if (isNaN(startDate) || isNaN(endDate)) {
            console.error(`Invalid date for booking ID ${booking.id}`);
            return null;
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
        .filter((booking) => booking !== null); // Filter out any invalid bookings

      console.log(ganttData, "ganttData");

      var dateToStr = gantt.date.date_to_str(gantt.config.task_date);
      var markerId = gantt.addMarker({
        start_date: new Date(), // a Date object that sets the marker's date
        css: "today", // a CSS class applied to the marker
        text: "Now", // the marker title
        title: dateToStr(new Date()), // the marker's tooltip
      });

      console.log(markerId, "markerId");

      // if (gantt.getMarker(markerId)) {
      //   gantt.parse({ data: ganttData });
      //   gantt.getMarker(markerId);
      // }

      gantt.parse({ data: ganttData });
      gantt.getMarker(markerId);

      //gantt.attachEvent("onTaskClick", (id, e) => {
      //  e.preventDefault();
      //  const clickedBookingId = id.toString();
      //  navigate(`/booking/${clickedBookingId}`);
      //});
    }
  }, [booked, navigate]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    setOpen(false);
    await execute();
  };

  const handleBookingSuccess = () => {
    setOpenSnackbar(true);
  };
  const handleSnackClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <section className="page container mt-5">
      <Snackbar
        open={setSnackbar}
        onClose={handleSnackClose}
        autoHideDuration={5000}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          You sucessfully added a new booking!
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
