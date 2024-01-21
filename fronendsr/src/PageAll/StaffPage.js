import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";

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
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const userName = localStorage.getItem("myname");

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    };

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

  const handleLogout = () => {
    window.localStorage.removeItem("jwtToken");
    axios.defaults.headers.common.Authorization = "";
    navigate("/");
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;

    // Handle the selected value based on your requirements
    switch (selectedValue) {
      case "addPerson":
        navigate("/addpage");
        break;
      case "uploadFile":
        navigate("/uploadx");
        break;
      case "addEvent":
        navigate("/addevent");
        break;
      default:
        // Handle default case if needed
        break;
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center" }}>Admin</h1>
      <Form.Select
        aria-label="Default select example"
        onChange={handleSelectChange}
      >
        <option>ฟังชั่นเพิ่มเติม</option>
        <option value="addPerson">Add 1 Person</option>
        <option value="uploadFile">Upload File</option>
        <option value="addEvent">Add Event</option>
      </Form.Select>
      <Button
        variant="danger"
        onClick={handleLogout}
        style={{ position: "absolute", top: "40px", left: "1340px" }}
      >
        Logout
      </Button>
      <ul className="list-unstyled">
        <h2 style={{ textAlign: "left" }}>
          รายชื่อนักศึกษา
        </h2>
        {events.map((entry) => (
          <li key={entry.id}>
            <Card className="my-3">
              <Card.Body>
                <Card.Title className="mb-">
                  {entry.Nickname ?? "ไม่ได้ใส่ชื่อ"} {entry.username}
                </Card.Title>
                <Button
                  variant="info"
                  onClick={() => handleViewDetails(entry.username)}
                >
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
