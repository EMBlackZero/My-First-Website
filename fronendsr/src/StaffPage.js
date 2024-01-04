import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Datapage from "./Datapage";
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
  const [jwt, setjwt] = Datapage("", "jwt");
  const navigate = useNavigate();

  const fetchData = async (withAuthorization) => {
    try {
      axios.defaults.headers.common = withAuthorization
        ? { Authorization: `Bearer ${jwt}` }
        : {};

      const response = await axios.get("http://localhost:1337/api/events");
      setEvents(response.data.data);
    } catch (error) {
      console.log(
        withAuthorization
          ? "Error fetching data with Authorization:"
          : "Error fetching data:",
        error
      );
    }
  };

  useEffect(() => {
    fetchData(false);
  }, []);

  useEffect(() => {
    if (jwt) {
      fetchData(true);
    }
  }, [jwt]);
  const handleViewDetails = (sculptor) => {
    setSelectedSculptor(sculptor);
    setpass(false);
  };
  const handleLogout = () => {
    window.localStorage.removeItem("jwt");
    axios.defaults.headers.common = {
      Authorization: ``,
    };
    navigate("/");
    setjwt("");
  };

  return (
    <Container style={containerStyle}>
      <h1>Staff Page</h1>
      <Button variant="info" onClick={() => handleLogout()}>
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
