import { NavLink } from "react-router-dom";
import "./navheader.css"; 

export default function NavHeader() {
  return (
    <nav className="nav-header">
      <ul>
        <li>
          <h1>
            <NavLink to="/" >UXV ESL</NavLink>
          </h1>
        </li>
      </ul>
      <ul>
        <li>
          <NavLink to="/warehouse" >Warehouse</NavLink>
        </li>
        <li>
          <NavLink to="/rooms" >Rooms</NavLink>
        </li>
      </ul>
    </nav>
  );
}
