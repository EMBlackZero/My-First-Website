import Modal from "react-bootstrap/Modal";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { type } from "@testing-library/user-event/dist/type";

function StaticExample(id) {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const issid = id.data;
  console.log(issid);
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  };
  useEffect(() => {
    axios
      .get(`http://localhost:1337/api/events/${issid}?populate=*`, config)
      .then(({ data }) => {
        setData2(data.data.attributes.entries.data.length);
        if(data2!==0){
            setData1(data.data.attributes.entries.data.map((d) => d.id));
        }

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    console.log("B", data2);
  }, [data2]);

  const handleDelete = (e) => {
    window.location.reload();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
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

      // ลบ event ที่กำหนดให้กับ issid ไม่อยู่ใน if block แล้ว
      axios.delete(`http://localhost:1337/api/events/${issid}`, config);
      console.log(`Event with ID ${issid} deleted successfully`);
      window.location.reload();
    } catch (error) {
      console.error(`Error deleting entries and event: ${error.message}`);
    }
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>ลบข้อevent</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Modal body text goes here.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleDelete}>
            No
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
}

export default StaticExample;