//admin
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Card, Button, Table } from "react-bootstrap";
function Datapage() {
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
  const userName = localStorage.getItem("mystname");
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      // สามารถเพิ่ม header อื่น ๆ ตามต้องการได้
    },
  };
  console.log(userName);

  useEffect(() => {
    //เก็บข้อมูล jwt ที่ได้จากการ login

    //เรียกข้อมูล
    axios
      .get("http://localhost:1337/api/entries?populate=*", config)
      .then(({ data }) => {
        const filteredData = data.data.filter(
          (item) =>
            item.attributes.users_permissions_user.data.attributes.username ==
            userName
        );
        setEvents(filteredData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const handleViewDetails = (sculptor) => {
    setSelectedSculptor(sculptor);
    setpass(false);
  };
  console.log(events);
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
      <h1>คะแนน</h1>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>วิชา</th>
            <th>คะแนน</th>
            <th>ประเภท</th>
            <th>ดูคะแนน(วัน/เวลา)</th>
            <th>รับทราบคะเเนน</th>
          </tr>
        </thead>
        <tbody>
          {events.map((data) => (
            <tr key={data.id}>
              <td>
                {
                  data.attributes.users_permissions_user.data.attributes
                    .username
                }
              </td>
              <td>{data.attributes.category.data.attributes.Subject}</td>
              <td>{data.attributes.result}</td>
              <td>{data.attributes.event.data.attributes.name}</td>
              <td>{data.attributes.seedate ?? "Not View"}</td>
              <td>{data.attributes.summit ? "Submit" : "Not Submit"}</td>
            </tr>
          ))}
        </tbody>
        <Button
          variant="info"
          onClick={() => navigate("/staff")}
          style={{
            position: "absolute",
            top: "350px",
            left: "1250px",
          }}
        >
          Back
        </Button>
      </Table>
    </>
  );
}

export default Datapage;
