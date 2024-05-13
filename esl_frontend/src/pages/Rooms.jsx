import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Rooms() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingDuration, setMeetingDuration] = useState('');

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  const handleTimeChange = e => {
    setSelectedTime(e.target.value);
  };

  const handleDurationChange = e => {
    setMeetingDuration(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log("Date:", selectedDate);
    console.log("Time:", selectedTime);
    console.log("Duration:", meetingDuration);
    //get which rooms are avaliable
    // make table for all avaliable rooms so user can pick which one
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Booking</p>
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
              placeholder="Enter time (e.g., 09:00 AM)"
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
