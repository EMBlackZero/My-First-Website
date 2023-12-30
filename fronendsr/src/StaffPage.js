import axios from "axios";
import React, { useEffect, useState } from "react";
import Datapage from "./Datapage";
function StaffPage() {
  const containerStyle = {
    backgroundColor: "#f0f0f0",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontSize: "1.5em",
    fontWeight: "bold",
  };
  const [selectedSculptor, setSelectedSculptor] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:1337/api/events");
        console.log("API response:", response);
        setEvents(response.data.data);
        console.log("fetching data", events.attributes.name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleViewDetails = (sculptor) => {
    setSelectedSculptor(sculptor);
  };
  return (
    <div>
      <h1 style={containerStyle}>Staff Page</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.attributes.name}{" "}
            <button onClick={() => handleViewDetails(event)}>View</button>
          </li>
        ))}
      </ul>

      {selectedSculptor && (
        <div style={containerStyle}>
          <h2>{events.attributes.name}</h2>
          <Datapage data={selectedSculptor} />
        </div>
      )}
    </div>
  );
}

export default StaffPage;
