import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const YourComponent = () => {
  const [result, setResult] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState();
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
    // Fetch categories when the component mounts
    axios
      .get("http://localhost:1337/api/categories", config)
      .then(({ data }) => {
        setCategories(data.data); // Assuming the actual category data is nested under data.data.data
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleCategoryIdChange = (e) => {
    setCategoryId(e.target.value);
  };
  console.log(categoryId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: result,
      datetime: eventDateTime,
      categories: parseInt(categoryId),
      teacher: userName,
    };

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
      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error creating entry:", error);
      // Handle errors here (e.g., display an error message to the user)
    }
    window.location.reload();
  };

  return (
    <Container>
      <h1>เพิ่มอีเว้น</h1>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Result:</Form.Label>
            <Form.Control
              type="text"
              value={result}
              onChange={(e) => setResult(e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Event Date Time:</Form.Label>
            <Form.Control
              type="datetime-local"
              value={eventDateTime}
              onChange={(e) => setEventDateTime(e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
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
        </Row>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default YourComponent;
