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
      .get("http://localhost:1337/api/events", config)
      .then(({ data }) => setEvents(data.data))
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const handleViewDetails = (sculptor) => {
    setSelectedSculptor(sculptor);
    setpass(false);
  };
  const handleLogout = () => {
    // Remove JWT Token from Local Storage
    window.localStorage.removeItem("jwtToken");
    // Clear Authorization Header in Axios Defaults
    axios.defaults.headers.common.Authorization = "";
    // Navigate to the "/" path (adjust this if using a different routing library)
    navigate("/");
  };

  return (
    <Container style={containerStyle}>
      <h1>Staff Page</h1>
      <Button
        variant="danger"
        onClick={() => handleLogout()}
        style={{ position: "absolute", top: "50px", left: "1240px" }}
      >
        Logout
      </Button>
      {!pass && (
        <Card>
          <Card.Body
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Card.Title>{selectedSculptor.attributes.name}</Card.Title>
            <Button variant="primary" onClick={() => setpass(true)}>
              Back
            </Button>
          </Card.Body>
        </Card>
      )}
      {pass && (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{event.attributes.name}</Card.Title>
                  <Button
                    variant="info"
                    onClick={() => handleViewDetails(event)}
                  >
                    View
                  </Button>
                </Card.Body>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

export default StaffPage;
