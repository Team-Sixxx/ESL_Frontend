import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom'; 

function Rooms() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingDuration, setMeetingDuration] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]); 
  const navigate = useNavigate();

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
    
    //const response = useAxios https://example.com/api/available-rooms?date=${date}&time=${time}&duration=${duration};
    //const data = await response.json();
    // if (isEmptyJson(data.rooms)) {
    //} else {
      //setAvailableRooms(data.rooms);
    //}
  };

  const handleRoomButtonClick = roomId => {
    console.log("Room button clicked:", roomId);
    // Book room with roomId trough api
    // if 200:
    // navigate('/meetings');  
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

        <div>
          <p>Available Rooms:</p>
          <table>
            <tbody>
              {availableRooms.map(room => (
                <tr key={room.id}>
                  <td><button onClick={() => handleRoomButtonClick(room.id)}>{room.name}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>
    </div>
  );
}

export default Rooms;
