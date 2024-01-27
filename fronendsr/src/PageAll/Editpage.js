import Modal from "react-bootstrap/Modal";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StaticExample(id) {
  const issid = id.data;
  console.log("id", id.data);
  const navigate = useNavigate();
  const [result, setResult] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState();
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

  console.log(categories);

  const handleCategoryIdChange = (e) => {
    setCategoryId(e.target.value);
  };
  const handleDelete = (e) => {
    window.location.reload();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: result,
      datetime: eventDateTime,
    };

    try {
      const response = await axios.put(
        `http://localhost:1337/api/events/${issid}`,
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
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>แก้ไขกิจกรรม</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Result:</Form.Label>
              <Form.Control
                type="text"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                size="sm" // Adjust the size as needed
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
                size="sm" // Adjust the size as needed
              />
            </Form.Group>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleDelete}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
}

export default StaticExample;
