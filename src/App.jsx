import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import RoleChecker from "./components/RoleChecker.jsx";
import Login from "./components/Login.jsx";
import Logout from "./components/logout.jsx";
import Home from "./Home";
import "./scss/styles.scss";
import Meetings from "./pages/Meetings";
import Rooms from "./pages/Rooms";
import Fail from "./pages/Fail";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/room/:id" element={<Rooms />} />
        <Route path="*" element={<Fail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/admin"
          element={<RoleChecker roles={["ADMIN"]}>hello admin</RoleChecker>}
        />
      </Routes>
    </Layout>
  );
}
