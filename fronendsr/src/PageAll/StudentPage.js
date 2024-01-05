import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Datapage from "./Datapage";
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
  const [jwt, setjwt] = Datapage("", "jwt");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1337/api/entries?populate=*"
        );
        console.log("API response:", response);
        setEntrys(response.data.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataWithAuthorization = async () => {
      try {
        axios.defaults.headers.common = {
          Authorization: `Bearer ${jwt}`,
        };
        const response = await axios.get(
          "http://localhost:1337/api/entries?populate=*"
        );
        setEntrys(response.data.data);
      } catch (error) {
        console.log("Error fetching data with Authorization:", error);
      }
    };

    if (jwt) {
      fetchDataWithAuthorization();
    }
  }, [jwt]);
  console.log("data", entrys);

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
          <h1>{selectedSculptor.attributes.event.data.attributes.name}</h1>
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
                  <Card.Title>
                    {entry.attributes.event.data.attributes.name}
                  </Card.Title>
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
  );
}

export default StudentPage;
