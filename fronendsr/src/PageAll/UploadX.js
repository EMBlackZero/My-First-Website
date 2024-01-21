import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Form, Button, Table, Spinner } from "react-bootstrap";

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
  const userName = localStorage.getItem("myname");
  const navigate = useNavigate();

  const handleCategoryIdChange = (e) => {
    setCategoryId(e.target.value);
  };

  const handleEventIdChange = (e) => {
    setEventId(e.target.value);
  };

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  };

  const handleFileChange = async (event) => {
    setLoading(true);

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
        const [response1, response2, response3] = await Promise.all([
          axios.get("http://localhost:1337/api/users", config),
          axios.get("http://localhost:1337/api/categories", config),
          axios.get("http://localhost:1337/api/events", config),
        ]);

        setEvents(response1.data);
        setCategories(response2.data.data);
        setEvents2(response3.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userName]);
  console.log("hhhh", events);

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

      for (const excelRow of excelData) {
        const studentId = excelRow[0];
        console.log(studentId);

        const matchedUser = filteredEmails.find(
          (item) => item.email.slice(0, 3) === studentId.toString()
        );
        console.log("ggg", matchedUser);
        if (matchedUser) {
          const userId = matchedUser.id;

          const response = await axios.post(
            "http://localhost:1337/api/entries",

            {
              data: {
                result: `${excelRow[1]}`,
                comment: `${excelRow[2]}`,
                users_permissions_user: parseInt(userId),
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
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
      <button onClick={postToStrapi} disabled={!excelData || loading}>
        Post to Strapi
      </button>
      <Button variant="info" onClick={() => navigate("/staff")}>
        Back
      </Button>
    </div>
  );
};

export default UploadFile;
