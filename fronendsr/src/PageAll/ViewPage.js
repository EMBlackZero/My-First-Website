//student
import React, { useEffect, useState } from "react";
import { Card, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewPage = () => {
  const navigate = useNavigate();
  const userid = localStorage.getItem("myid");
  const userName = localStorage.getItem("myname");
  const usersub = localStorage.getItem("mysub");
  const [datas, setDatas] = useState([]);
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      // สามารถเพิ่ม header อื่น ๆ ตามต้องการได้
    },
  };
  const [selectedSculptor, setSelectedSculptor] = useState(null);
  const url = `http://localhost:1337/api/entries?populate[event][filters][id][$eq]=${userid}&populate[users_permissions_user][filters][username][$eq]=${userName}&populate[category][filters][Subject][$eq]=${usersub}`;

  console.log(userName);

  useEffect(() => {
    //เรียกข้อมูล
    axios
      .get(url, config)
      .then(({ data }) => {
        const filteredData = data.data.filter(
          (item) =>
            item.attributes.event.data !== null &&
            item.attributes.users_permissions_user.data !== null &&
            item.attributes.category.data !== null
        );
        setDatas(filteredData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle the error, e.g., set an error state
      });
  }, []);
  console.log("viwedata", datas);

  const handleLogout = () => {
    // Remove JWT Token from Local Storage
    window.localStorage.removeItem("jwtToken");
    // Clear Authorization Header in Axios Defaults
    axios.defaults.headers.common.Authorization = "";
    // Navigate to the "/" path (adjust this if using a different routing library)
    navigate("/");
  };
  const Summitbutthon = (data) => {

    axios.get(`http://localhost:1337/api/entries/${data}/summit`, config) 
    window.location.reload();
  };

  return (
    <>
      <h1>คะแนน</h1>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>คะแนน</th>
            <th>Comment</th>
            <th>รับทราบคะแนน</th>
          </tr>
        </thead>
        <tbody>
          {datas.map((data) => (
            <tr key={data.id}>
              <td>
                {
                  data.attributes.users_permissions_user.data.attributes
                    .username
                }
              </td>
              <td>{data.attributes.result}</td>
              <td>{data.attributes.comment}</td>
              <td>
                <Button
                  onClick={() => Summitbutthon(data.id)}
                  variant={data.attributes.summit ? "success" : "danger"}
                  className="mt-2" // Add additional Bootstrap classes for spacing if needed
                >
                  <span style={{ fontWeight: "bold" }}>Summit Point</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <Button
          variant="info"
          onClick={() => navigate("/student")}
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
};

export default ViewPage;
