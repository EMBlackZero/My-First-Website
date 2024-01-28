import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";

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
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [pass, setpass] = useState(true);
  const userName = localStorage.getItem("myname");
  const Role = localStorage.getItem("role");

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  };
  useEffect(() => {
    if (Role !== "staff") {
      window.localStorage.removeItem("jwtToken");
      axios.defaults.headers.common.Authorization = "";
      navigate("/");
    }
    axios.get(`http://localhost:1337/api/users`, config).then(({ data }) => {
      const filteredEmails = data.filter((item) => item.email.match(/^\d{2}/));
      setEvents(filteredEmails);
    });
    axios
      .get("http://localhost:1337/api/entries?populate=*", config)
      .then(({ data }) => setData(data.data))
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  console.log(data);

  const handleViewDetails = (stname) => {
    localStorage.setItem("mystname", stname);
    navigate("/datapage");
  };

  const handleLogout = () => {
    window.localStorage.removeItem("jwtToken");
    axios.defaults.headers.common.Authorization = "";
    navigate("/");
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center" }}>{userName}</h1>
      <Button variant="success" onClick={() => navigate("/addpage")}>
        Add Page
      </Button>
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
          <Form>
            <InputGroup className="my-3">
              {/* onChange for search */}
              <Form.Control
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID"
              />
            </InputGroup>
          </Form>
        </h2>
        {search.length === 0 &&
          events.map((entry) => (
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
        {search.length > 0 && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>วิชา</th>
                <th>คะแนน</th>
                <th>ประเภท</th>
                <th>ดูคะแนน(วัน/เวลา)</th>
                <th>รับทราบคะเเนน</th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((item) => {
                  return search.toLowerCase() === ""
                    ? item
                    : item.attributes.users_permissions_user.data.attributes.username.includes(
                        search
                      );
                })
                .map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.attributes.users_permissions_user.data.attributes
                        .username ?? " "}
                    </td>
                    <td>
                      {item.attributes.category.data.attributes.Subject ?? " "}
                    </td>

                    <td>{item.attributes.result ?? " "}</td>

                    <td>{item.attributes.event.data.attributes.name ?? " "}</td>
                    <td>
                      {item.attributes.seedate
                        ? new Date(item.attributes.seedate).toLocaleString(
                            "en-GB"
                          )
                        : "Not View"}
                    </td>
                    <td
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {item.attributes.summit ? "Submit" : "Not Submit"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </ul>
    </div>
  );
}

export default StaffPage;
