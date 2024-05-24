import React, { useEffect, useState } from "react";
import useAxios from "axios-hooks";
import { API_URL } from "./settings";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "./context/AuthProvider";
import {
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Skeleton,
  Container,
} from "@mui/material";
import "./home.css";

export default function Home() {
  const [bookingsObject, setBookings] = useState([]);
  const SCREENINGS_URL = `${API_URL}/api/meetingrooms`;
  const auth = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState(true);

  function handleClick() {
    navigate("/room/1");
  }

  const [{ data: bookings, loading: postLoading, error: postError }, execute] =
    useAxios({
      url: SCREENINGS_URL,
      headers: {
        "Access-Control-Allow-Credentials": true,
      },
    });

  useEffect(() => {
    async function fetchData() {
      await execute();
    }
    fetchData();
  }, [execute]);

  useEffect(() => {
    if (bookings) {
      if (auth.username != null) {
        //console.log(status);
        //console.log(auth.isLoggedIn());
        setStatus(false);
      }

      setBookings(bookings);
    }
  }, [bookings]);

  return (
    <Container>
      <Grid
        container
        spacing={3}
        justify="center"
        style={{ marginTop: "20px" }}
      >
        {postLoading ? (
          <Grid item xs={12}>
            <Skeleton variant="rectangular" width="100%" height={200} />
          </Grid>
        ) : (
          bookingsObject.map((room) => (
            <Grid item key={room.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {room.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Capacity: {room.capacity}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Location: {room.location}
                  </Typography>{" "}
                  <Button
                    variant="contained"
                    type="button"
                    onClick={handleClick}
                    disabled={!auth.isLoggedIn()}
                  >
                    {" "}
                    Book room
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
        {postError && (
          <Grid item xs={12}>
            <Typography color="error">Failed to load meeting rooms.</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
