import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../CSSAll/stpage.css";
import { Card, Button, Table, InputGroup, Form } from "react-bootstrap";
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
  const [search, setSearch] = useState("");
  const Nickname = localStorage.getItem("mynickname");
  const Role = localStorage.getItem("role");
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      // สามารถเพิ่ม header อื่น ๆ ตามต้องการได้
    },
  };

  useEffect(() => {
    if (Role !== "student") {
      window.localStorage.removeItem("jwtToken");
      axios.defaults.headers.common.Authorization = "";
      navigate("/");
    }
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

  const handleLogout = () => {
    // Remove JWT Token from Local Storage
    window.localStorage.removeItem("jwtToken");
    // Clear Authorization Header in Axios Defaults
    axios.defaults.headers.common.Authorization = "";
    // Navigate to the "/" path (adjust this if using a different routing library)
    navigate("/");
  };

  const handleViewDetails = (sculptor, subject) => {
    setSelectedSculptor(sculptor);
    localStorage.setItem("mysub", subject);
    setpass(false);
  };

  const handleid = (id) => {
    localStorage.setItem("myid", id); //setid
    navigate("/viewpage");
  };
  const handleid2 = (id, subject) => {
    localStorage.setItem("myid", id); //setid
    navigate("/viewpage");
    localStorage.setItem("mysub", subject);
  };

  return (
    <div className="stpage">
      <h1>{Nickname}</h1>
      <h2>
        รายวิชา
        <Form>
          <InputGroup className="my-3">
            {/* onChange for search */}
            <Form.Control
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Event"
            />
          </InputGroup>
        </Form>
      </h2>
      <Button
        variant="danger"
        onClick={() => handleLogout()}
        style={{ position: "absolute", top: "50px", left: "1100px" }}
      >
        Logout
      </Button>
      <ul>
        {search.length === 0 &&
          pass &&
          entrys.map((entry) => (
            <li key={entry.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{entry.attributes.Subject}</Card.Title>
                  <Button
                    variant="info"
                    onClick={() =>
                      handleViewDetails(
                        entry.attributes.events.data,
                        entry.attributes.Subject
                      )
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
                    <Card.Title>
                      เปิดได้ก็ต่อเมื่อ{"  "}
                      {new Date(sb.attributes.datetime).toLocaleString("en-GB")}
                    </Card.Title>
                    <Button
                      variant="info"
                      onClick={() => handleid(sb.id)}
                      disabled={new Date(sb.attributes.datetime) >= new Date()}
                    >
                      View
                    </Button>
                  </Card.Body>
                </Card>
              </li>
            ))}
            <Button
              variant="info"
              onClick={() => setpass(true)}
              style={{
                position: "absolute",
                top: "350px",
                left: "1100px",
              }}
            >
              go Back
            </Button>
          </>
        )}
        {search.length > 0 && (
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>ชื่อกิจกรรม</th>
                <th>เปิดได้ก็ต่อเมื่อ</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {entrys
                .filter((item) => {
                  return search.toLowerCase() === ""
                    ? true
                    : item.attributes.events.data.some((event) =>
                        event.attributes.name.includes(search)
                      );
                })
                .map((item) => (
                  <tr key={item.id}>
                    {item.attributes.events.data.map((event) => (
                      <React.Fragment key={event.id}>
                        <td>{event.attributes.name}</td>
                        <td>
                          {new Date(event.attributes.datetime).toLocaleString(
                            "en-GB"
                          )}
                        </td>
                        <td>
                          {
                            <Button
                              variant="info"
                              onClick={() =>
                                handleid2(event.id, item.attributes.Subject)
                              }
                              disabled={
                                new Date(event.attributes.datetime) >=
                                new Date()
                              }
                            >
                              View
                            </Button>
                          }
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </ul>
    </div>
  );
}

export default StudentPage;
