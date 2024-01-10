import React, { useEffect, useState } from "react";
import { Card, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewPage = () => {
  const navigate = useNavigate();
  const userid = localStorage.getItem("myid");
  const userName = localStorage.getItem("myname");
  const [datas, setDatas] = useState([]);
  const [selectedSculptor, setSelectedSculptor] = useState(null);
  const url = `http://localhost:1337/api/entries?populate[event][filters][id][$eq]=${userid}&populate[users_permissions_user][filters][username][$eq]=${userName}`;

  console.log(userName);

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
      .get(url, config)
      .then(({ data }) => {
        const filteredData = data.data.filter(
          (item) =>
            item.attributes.event.data !== null &&
            item.attributes.users_permissions_user.data !== null
        );
        setDatas(filteredData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle the error, e.g., set an error state
      });
  }, []);
  console.log(datas);

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
            <th>คะแนน</th>
            <th>PASS</th>
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
              <td>{data.attributes.result >= 50 ? "PASS" : "FAIL"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ViewPage;
