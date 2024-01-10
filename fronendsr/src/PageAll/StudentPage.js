import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import ViewPage from "./ViewPage";
function StudentPage() {
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
  const [entrys, setEntrys] = useState([]);
  const [pass, setpass] = useState(true);
  const navigate = useNavigate();
  
  const savedataToLocalStorage = (dataa) => {
    localStorage.setItem("isdata", dataa);
  };

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
      .get("http://localhost:1337/api/events?populate=*", config)
      .then(({ data }) => setEntrys(data.data))
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle the error, e.g., set an error state
      });

  }, []);
  
  savedataToLocalStorage(entrys);
  console.log("data1", entrys);

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
    <>
      <Container style={containerStyle}>
        <h1>Student Page</h1>
        <Button
          variant="danger"
          onClick={() => handleLogout()}
          style={{ position: "absolute", top: "50px", left: "1240px" }}
        >
          Logout
        </Button>
        {!pass && (
          <>
            <h1>{selectedSculptor.attributes.name}</h1>
            <ViewPage data={selectedSculptor} />
            <Button
              variant="info"
              onClick={() => setpass(true)}
              style={{ position: "absolute", top: "350px", left: "1250px" }}
            >
              Back
            </Button>
          </>
        )}

        {pass && (
          <ul>
            {entrys.map((entry) => (
              <li key={entry.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{entry.attributes.name}</Card.Title>
                    <Button
                      variant="info"
                      onClick={() => handleViewDetails(entry)}
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
    </>
  );
}

export default StudentPage;
