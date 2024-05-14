import React, { useState, useEffect } from 'react';

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch('https://localhost:7154/api/meetingrooms');
      console.log(response);
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const createRoom = async (newRoom) => {
    try {
        // Generate a temporary unique key for the new room
        const tempId = Math.floor(Math.random() * 1000000); // Example: Temporary unique key

        // Add the temporary id to the new room object
        const roomWithTempId = { ...newRoom, id: tempId };

        // Make the POST request to create the room
        const response = await fetch('https://localhost:7154/api/meetingrooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roomWithTempId),
        });
        console.log(response);

        // Check if the request was successful
        if (response.ok) {
            // Get the created room data from the response
            const data = await response.json();
            // Replace the room with the temporary id with the actual room with the generated id
            setRooms([...rooms.filter(room => room.id !== tempId), data]);
        } else {
            console.error('Failed to create room:', response.statusText);
        }
    } catch (error) {
        console.error('Error creating room:', error);
    }
};


  const deleteRoom = async (roomId) => {
    try {
      await fetch(`https://localhost:7154/api/meetingrooms/${roomId}`, {
        method: 'DELETE'
      });
      setRooms(rooms.filter((room) => room.id !== roomId));
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const updateRoom = async (roomId, updatedRoom) => {
    try {
      const response = await fetch(`https://localhost:7154/api/meetingrooms/${roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRoom),
      });
      const data = await response.json();
      setRooms(rooms.map((room) => (room.id === roomId ? data : room)));
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  return (
    <div>
      <h1>Manage Rooms</h1>
      {/* Render the list of rooms */}
      {rooms.map((room) => (
        <div key={room.id}>
          <h3>{room.name}</h3>
          <p>Capacity: {room.capacity}</p>
          <p>Location: {room.location}</p>
          {/* Add buttons for deleting and updating the room */}
          <button onClick={() => deleteRoom(room.id)}>Delete</button>
          <button onClick={() => updateRoom(room.id, { ...room, name: 'Updated Room' })}>Update</button>
        </div>
      ))}
      {/* Add a form for creating a new room */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const newRoom = {
          name: e.target.name.value,
          capacity: parseInt(e.target.capacity.value),
          location: e.target.location.value,
        };
        createRoom(newRoom);
        e.target.reset();
      }}>
        <h2>Create New Room</h2>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" required />
        <label htmlFor="capacity">Capacity:</label>
        <input type="number" id="capacity" required />
        <label htmlFor="location">Location:</label>
        <input type="text" id="location" required />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default ManageRooms;
