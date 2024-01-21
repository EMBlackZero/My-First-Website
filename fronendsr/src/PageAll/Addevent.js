import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEntryForm = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");

  const handleResultChange = (e) => {
    setResult(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: result,
      datetime: eventDateTime,
    };

    console.log(formData);

    try {
      const response = await axios.post(
        "http://localhost:1337/api/events",
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
      // Handle errors here (e.g., display an error message to the user)
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
          <Form.Label>NameEvent</Form.Label>
          <Form.Control
            type="text"
            name="result"
            placeholder="ชื่อกิจกรรม"
            value={result}
            onChange={handleResultChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>เวลาประกาศ</Form.Label>
          <Form.Control
            type="datetime-local"
            placeholder="เพิ่มอีเว้น"
            value={eventDateTime}
            onChange={(e) => setEventDateTime(e.target.value)}
            style={{ width: "200px" }}
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
