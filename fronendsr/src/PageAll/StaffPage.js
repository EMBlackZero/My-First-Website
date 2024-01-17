import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";

function StaffPage() {
  const containerStyle = {
    backgroundColor: "#f0f0f0",
    padding: "20px 10px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
    fontSize: "1.5em",
    fontWeight: "bold",
  };
  const [selectedSculptor, setSelectedSculptor] = useState(null);
  const [events, setEvents] = useState([]);
  const [pass, setpass] = useState(true);
  const navigate = useNavigate();
  const userName = localStorage.getItem("myname");
  useEffect(() => {
    //เก็บข้อมูล jwt ที่ได้จากการ login
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        // สามารถเพิ่ม header อื่น ๆ ตามต้องการได้
      },
    };

    //เรียกข้อมูล
    axios
      .get(
        `http://localhost:1337/api/users?filters[username][$ne]=${userName}`,
        config
      )
      .then(({ data }) => setEvents(data))
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const handleViewDetails = (stname) => {
    localStorage.setItem("mystname", stname);
    navigate("/datapage");
  };
  console.log('data',events);
  const handleLogout = () => {
    // Remove JWT Token from Local Storage
    window.localStorage.removeItem("jwtToken");
    // Clear Authorization Header in Axios Defaults
    axios.defaults.headers.common.Authorization = "";
    // Navigate to the "/" path (adjust this if using a different routing library)
    navigate("/");
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center" }}>Admin</h1>
      <Button
        variant="danger"
        onClick={() => handleLogout()}
        style={{ position: "absolute", top: "40px", left: "1340px" }}
      >
        Logout
      </Button>
      <ul className="list-unstyled">
        <h2 style={{ textAlign: "left" }}>รายชื่อนักศึกษา</h2>
        {/* Use Bootstrap utility class for removing list styling */}
        {events.map((entry) => (
          <li key={entry.id}>
            <Card className="my-3">
              {" "}
              {/* Add margin to the Card */}
              <Card.Body>
                <Card.Title className="mb-">{entry.username}</Card.Title>
                <Button variant="info" onClick={() => handleViewDetails(entry.username)}>
                  View
                </Button>
              </Card.Body>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StaffPage;
