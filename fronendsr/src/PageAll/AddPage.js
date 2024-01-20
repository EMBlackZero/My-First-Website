import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEntryForm = () => {
  const userName = localStorage.getItem("myname");
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [events2, setEvents2] = useState([]);
  const [result, setResult] = useState("");
  const [userId, setUserId] = useState();
  const [categoryId, setCategoryId] = useState();
  const [eventId, setEventId] = useState(); // Added state for eventId
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      };

      try {
        const response1 = await axios.get(
          `http://localhost:1337/api/users?filters[username][$ne]=${userName}`,
          config
        );
        setEvents(response1.data);

        const response2 = await axios.get(
          "http://localhost:1337/api/categories",
          config
        );
        setCategories(response2.data.data);

        const response3 = await axios.get(
          "http://localhost:1337/api/events",
          config
        );
        setEvents2(response3.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userName]);

  const handleResultChange = (e) => {
    setResult(e.target.value);
  };

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleCategoryIdChange = (e) => {
    setCategoryId(e.target.value);
  };

  const handleEventIdChange = (e) => {
    setEventId(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      result: result,
      comment: comment,
      users_permissions_user: parseInt(userId),
      event: parseInt(eventId),
      category: parseInt(categoryId),
    };

    console.log(formData);

    try {
      const response = await axios.post(
        "http://localhost:1337/api/entries",
        { data: formData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      window.location.reload();
      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error creating entry:", error);
      // เพิ่มตรวจสอบและการจัดการข้อผิดพลาดที่นี่ (เช่น แสดงข้อความข้อผิดพลาดให้ผู้ใช้เห็น)
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="result">
          <Form.Label>คะแนน</Form.Label>
          <Form.Control
            type="text"
            name="result"
            placeholder="กรอกคะแนน"
            value={result}
            onChange={handleResultChange}
          />
        </Form.Group>

        <Form.Group controlId="userId">
          <Form.Label>รหัสามตัวสุดท้ายของนักศึกษา</Form.Label>
          <Form.Select
            aria-label="Default select example"
            name="userId"
            value={userId}
            onChange={handleUserIdChange}
          >
            <option>เลือกรหัสามตัวสุดท้ายของนักศึกษา</option>
            {events.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

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

        <Form.Group controlId="comment">
          <Form.Label>Comment:</Form.Label>
          <Form.Control
            type="text"
            name="comment"
            value={comment}
            onChange={handleCommentChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
        <Button variant="info" onClick={() => navigate("/staff")}>
          Back
        </Button>
      </Form>
    </div>
  );
};

export default CreateEntryForm;
