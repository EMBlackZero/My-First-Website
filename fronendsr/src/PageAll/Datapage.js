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
  const [events, setEvents] = useState([]);
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

  console.log(events);
  const handleLogout = () => {
    // Remove JWT Token from Local Storage
    window.localStorage.removeItem("jwtToken");
    // Clear Authorization Header in Axios Defaults
    axios.defaults.headers.common.Authorization = "";
    // Navigate to the "/" path (adjust this if using a different routing library)
    navigate("/");
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:1337/api/entries/${id}`, config);
    window.location.reload();
  };

  return (
    <>
      <h1 style={{ display: "flex", justifyContent: "center" }}>คะแนน</h1>
      <Table striped bordered hover className="mt-4">
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
              <td>
                {new Date(data.attributes.seedate).toLocaleString("en-GB") ??
                  "Not View"}
              </td>
              <td
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {data.attributes.summit ? "Submit" : "Not Submit"}
                <Button variant="danger" onClick={() => handleDelete(data.id)}>
                  <span style={{ fontWeight: "bold" }}>Delete</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <Button
          variant="info"
          onClick={() => navigate("/staff")}
          style={{
            position: "absolute",
            top: "20px",
            left: "12px",
          }}
        >
          Back
        </Button>
      </Table>
    </>
  );
}

export default Datapage;
