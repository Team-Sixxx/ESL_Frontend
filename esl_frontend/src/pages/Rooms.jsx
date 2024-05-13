import React, { useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom'; 

function Rooms() {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingDuration, setMeetingDuration] = useState('');
  const [booked, setBooked] = useState([]); 
  const navigate = useNavigate();

  //fetch bookings for room {id} and put into setBooked

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
    //const response = useAxios https://example.com/api/bookRoom?date=${date}&time=${time}&duration=${duration}&id=${id};
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
                  <td>{room.name}</td>
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
      </header>
    </div>
  );
}

export default Rooms;
