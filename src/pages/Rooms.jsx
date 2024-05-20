import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/skins/dhtmlxgantt_contrast_white.css';
import { useNavigate } from 'react-router-dom';
import useAxios from "axios-hooks";

function Rooms() {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingDuration, setMeetingDuration] = useState('');
  const [booked, setBooked] = useState([]);
  const navigate = useNavigate();

  const [{ data: bookings, loading: bookingsLoading, error: bookingsError }, execute] = useAxios({
    url: `https://localhost:7154/api/bookingroom/${id}`,
    headers: {
      "Access-Control-Allow-Credentials": true,
    },
  }, { manual: true });
  
  useEffect(() => {
    async function fetchData() {
      await execute();
    }
    fetchData();
  }, [execute]);
  
  useEffect(() => {
    if (bookings) {
      setBooked(bookings);
    }
  }, [bookings]);

  useEffect(() => {
    if (booked.length > 0) {
      gantt.init('gantt-container');
      gantt.plugins({
        marker: true,
      });

      const ganttData = booked.map((booking) => ({
        id: booking.id,
        text: booking.text,
        start_date: new Date(booking.start_date),
        duration: booking.duration,
      }));

      const dateToStr = gantt.date.date_to_str(gantt.config.task_date);
      const markerId = gantt.addMarker({
        start_date: new Date(), // a Date object that sets the marker's date
        css: 'today', // a CSS class applied to the marker
        text: 'Now', // the marker title
        title: dateToStr(new Date()), // the marker's tooltip
      });

      gantt.parse({ data: ganttData });
      gantt.getMarker(markerId);

      gantt.attachEvent('onTaskClick', (id, e) => {
        e.preventDefault();
        const clickedBookingId = id.toString();
        navigate(`/booking/${clickedBookingId}`);
      });
    }
  }, [booked]);

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  const handleTimeChange = e => {
    setSelectedTime(e.target.value);
  };

  const handleDurationChange = e => {
    setMeetingDuration(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log("Date:", selectedDate);
    console.log("Time:", selectedTime);
    console.log("Duration:", meetingDuration);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const bookingDate = new Date(selectedDate);
    bookingDate.setHours(hours, minutes);

    console.log("Booking Date:", bookingDate);
    console.log("Duration:", meetingDuration);
    
    // const response = useAxios https://example.com/api/bookRoom?date=${date}&time=${time}&duration=${duration}&id=${id};
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Room {id}</p>
        <div>
          <p>Room booked: </p>
          <table>
            <tbody>
              {booked.map(room => (
                <tr key={room.id}>
                  <td>{room.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <form onSubmit={handleSubmit}>
          <div>
            <p>Select Date:</p>
            <DatePicker selected={selectedDate} onChange={handleDateChange} />
          </div>
          <div>
            <p>Enter Time:</p>
            <input
              type="text"
              value={selectedTime}
              onChange={handleTimeChange}
              placeholder="Enter time (e.g., 09:00)"
            />
          </div>
          <div>
            <p>Enter Duration (in minutes):</p>
            <input
              type="text"
              value={meetingDuration}
              onChange={handleDurationChange}
              placeholder="Enter duration"
            />
          </div>
          <button type="submit">Submit</button>
          
        </form>
        <br></br>
        <div id="gantt-container" style={{ width: '100%', height: '400px' }}></div>

      </header>
    </div>
  );
}

export default Rooms;
