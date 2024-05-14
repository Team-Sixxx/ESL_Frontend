import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NavHeader from "./components/NavHeader";
import './App.css';
import  Warehouse  from "./pages/Warehouse"
import  Booking  from "./pages/Booking"
import  Meetings  from "./pages/Meetings"
import  Rooms  from "./pages/Rooms"
import  Fail  from "./pages/Fail"
import  ManageRooms  from "./pages/ManageRooms"

export default function App() {
  return (
    <Router>
      <NavHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/ManageRooms" element={<ManageRooms />} />
        <Route path="/Booking" element={<Booking />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/room/:id" element={<Rooms />} />
        <Route path="*" element={<Fail />} />
      </Routes>
    </Router>
  );
}
