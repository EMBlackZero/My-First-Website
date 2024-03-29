import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import {Card, Form, Button, Spinner } from "react-bootstrap";

const UploadFile = () => {
  const [excelData, setExcelData] = useState(null);
  const [stdid, setStdid] = useState([]);
  const [postSuccess, setPostSuccess] = useState(false);
  const [events2, setEvents2] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState();
  const [categoryId, setCategoryId] = useState();
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const userName = localStorage.getItem("myname");
  const Role = localStorage.getItem("role");
  const navigate = useNavigate();
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  };
  const handleCategoryIdChange = async (e) => {
    const id = e.target.value;
    try {
      const response3 = await axios.get(
        `http://localhost:1337/api/categories/${id}?populate=*`,
        config
      );
      setEvents2(response3.data.data.attributes.events.data);
      setCategoryId(e.target.value);
    } catch (error) {
      console.error("Error fetching events data:", error);
      // Handle the error, e.g., set an error state
    }
  };

  const handleEventIdChange = (e) => {
    axios
      .get(
        `http://localhost:1337/api/events/${e.target.value}?populate=*`,
        config
      )
      .then(({ data }) => {
        setData2(data.data.attributes.entries.data.length);
        if (data2 !== 0) {
          setData1(data.data.attributes.entries.data.map((d) => d.id));
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    setLoading(true);
    setEventId(e.target.value);
  };

  useEffect(() => {
    if (Role !== "staff") {
      window.localStorage.removeItem("jwtToken");
      axios.defaults.headers.common.Authorization = "";
      navigate("/");
    }
  });

  const handleFileChange = async (event) => {
    try {
      const selectedFile = event.target.files[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          console.log("Excel Data:", parsedData);
          setExcelData(parsedData);
        } catch (error) {
          console.error("Error reading Excel file:", error);
        } finally {
          setLoading(false);
        }
      };

      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error("Error handling file change:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [response1, response2] = await Promise.all([
          axios.get("http://localhost:1337/api/users", config),
          axios.get("http://localhost:1337/api/categories", config),
        ]);

        setEvents(response1.data);
        setCategories(response2.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userName]);

  const postToStrapi = async () => {
    try {
      const filteredEmails = events.filter((item) =>
        item.email.match(/^\d{2}/)
      );

      const filteredstdid = filteredEmails.map((item) => ({
        id: item.id,
        email: item.email,
      }));
      setStdid(filteredstdid);
      console.log(stdid);
      if (data2 !== 0) {
        // ให้ใช้ Promise.all เพื่อรอให้ทุก request เสร็จสิ้น
        data1.map((i) => {
          try {
            // ให้ใส่ await และใช้ async function
            axios.delete(`http://localhost:1337/api/entries/${i}`, config);
            console.log(`Entry with ID ${i} deleted successfully`);
          } catch (error) {
            console.error(
              `Error deleting entry with ID ${i}: ${error.message}`
            );
          }
        });
      }
      for (const excelRow of excelData) {
        const studentId = excelRow[0];

        const matchedUser = filteredEmails.find(
          (item) => item.email.slice(0, 3) === studentId.toString()
        );
        if (matchedUser) {
          const userId = matchedUser.id;

          const response = await axios.post(
            "http://localhost:1337/api/entries",

            {
              data: {
                result: `${excelRow[1]}`,
                comment: `${excelRow[2]}`,
                users_permissions_user: parseInt(userId),
                teacher: userName,
                category: parseInt(categoryId),
                event: parseInt(eventId),
              },
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            }
          );

          console.log("Post to Strapi successful:", response.data);
          setPostSuccess(true);
        }
      }
      window.location.reload();
    } catch (error) {
      console.error("Error posting to Strapi:", error);
      // Display a user-friendly error message to the user
    }
  };

  useEffect(() => {
    if (postSuccess) {
      setPostSuccess(false);
    }
  }, [postSuccess]);

  return (
    <>
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        อัพไฟล์ขึ้นDataBase
      </h1>
      <h2
        style={{
          display: "flex",
          justifyContent: "center",
          color: "red",
        }}
      >
        ***โปรดระมัดระวังในการเพิ่มไฟล์หากข้างใน(ประเภท)ที่เลือกมีข้อมูลจะทำการลบข้อมูลด้านใน***
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          animation: "moveUp 2s forwards", // Add animation property
          border: "2px solid black", // Add border for rectangular frame
        }}
      >
        {loading && <Spinner animation="border" role="status" />}
        <input type="file" onChange={handleFileChange} />
        <Form.Group controlId="categoryId">
          <Form.Label>เลือกวิชา</Form.Label>
          <Form.Select
            aria-label="Default select example"
            name="categoryId"
            value={categoryId}
            onChange={handleCategoryIdChange}
          >
            <option>เลือกวิชา</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.attributes.Subject}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="eventId">
          <Form.Label>เลือกประเภท</Form.Label>
          <Form.Select
            aria-label="Default select example"
            name="eventId"
            value={eventId}
            onChange={handleEventIdChange}
          >
            <option>เลือกประเภท</option>
            {events2.map((event) => (
              <option key={event.id} value={event.id}>
                {event.attributes.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button variant="info" onClick={postToStrapi} disabled={!loading}>
          Post to Strapi
        </Button>
      </div>
    </>
  );
};

export default UploadFile;
