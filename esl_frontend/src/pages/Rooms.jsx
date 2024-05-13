import { useParams, NavLink } from "react-router-dom";

function Rooms() {
    const { id } = useParams();

    return (
      <div className="App">
        <header className="App-header">
          <p>
            Rooms {id}
          </p>
        </header>
      </div>
    );
  }
  
  export default Rooms;