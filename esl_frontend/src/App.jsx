import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NavHeader from "./components/NavHeader";
import './app.css';
import  Warehouse  from "./pages/Warehouse"
import  Rooms  from "./pages/Rooms"
import  Meetings  from "./pages/Meetings"


export default function App() {
  return (
    <Router>
      <NavHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/meetings" element={<Meetings />} />
      </Routes>
    </Router>
  );
}
