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
  const [selectedSculptor, setSelectedSculptor] = useState([]);
  const [entrys, setEntrys] = useState([]);
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
      .get("http://localhost:1337/api/categories?populate=*", config)
      .then(({ data }) => {
        setEntrys(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle the error, e.g., set an error state
      });
  }, []);
  console.log("data", entrys);
  const handleLogout = () => {
    // Remove JWT Token from Local Storage
    window.localStorage.removeItem("jwtToken");
    // Clear Authorization Header in Axios Defaults
    axios.defaults.headers.common.Authorization = "";
    // Navigate to the "/" path (adjust this if using a different routing library)
    navigate("/");
  };

  const handleViewDetails = (sculptor,subject) => {
    setSelectedSculptor(sculptor);
    localStorage.setItem("mysub", subject);
    console.log(localStorage.getItem("myid"));
    console.log(localStorage.getItem("mysub"));
    setpass(false);
  };

  const handleid = (id, ) => {
    console.log("ID:", id);

    // Convert id to a number if needed

    localStorage.setItem("myid", id);
    navigate("/viewpage");

    console.log(localStorage.getItem("myid"));
    console.log(localStorage.getItem("mysub"));
  };

  return (
    <div style={containerStyle}>
      <h1>คะแนนสอบของ นาย{userName}</h1>
      <Button
        variant="danger"
        onClick={() => handleLogout()}
        style={{ position: "absolute", top: "50px", left: "1240px" }}
      >
        Logout
      </Button>
      <ul>
        {pass &&
          entrys.map((entry) => (
            <li key={entry.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{entry.attributes.Subject}</Card.Title>
                  <Button
                    variant="info"
                    onClick={() =>
                      handleViewDetails(entry.attributes.events.data,entry.attributes.Subject)
                    }
                  >
                    View
                  </Button>
                </Card.Body>
              </Card>
            </li>
          ))}
        {!pass && (
          <>
            {selectedSculptor.map((sb) => (
              <li key={sb.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{sb.attributes.name}</Card.Title>
                    <Button
                      variant="info"
                      onClick={() => handleid(sb.id, sb.attributes.Subject)}
                    >
                      View
                    </Button>
                    <Button
                      variant="info"
                      onClick={() => setpass(true)}
                      style={{
                        position: "absolute",
                        top: "350px",
                        left: "1250px",
                      }}
                    >
                      go Back
                    </Button>
                  </Card.Body>
                </Card>
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
}

export default StudentPage;
