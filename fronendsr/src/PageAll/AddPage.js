import React, { useEffect, useState } from "react";
import { Form, Button, Tab, Tabs, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UploadX from "./UploadX";
import Addevent from "./Addevent";
import Editpage from "./Editpage";
import Deletepage from "./Deletepage";

const CreateEntryForm = () => {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [id1, setid1] = useState([]);
  const [id2, setid2] = useState([]);
  const [showeditd, setshowedit] = useState(true);
  const [showdelete, setshowdelete] = useState(true);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  };
  useEffect(() => {
    axios
      .get("http://localhost:1337/api/events?populate=*", config)
      .then(({ data }) => setData(data.data))
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleEdit = (id) => {
    setid2(id);
    setshowedit(false);
  };
  const handleDelete = (id) => {
    setid2(id);
    setshowdelete(false);
  };


  return (
    <>
      <Button variant="info" onClick={() => navigate("/staff")}>
        Back
      </Button>
      <Tabs activeKey={activeTab} onSelect={handleTabChange}>
        <Tab eventKey="home" title="Up Point Excel">
          <Tab.Content>
            <Tab.Pane eventKey="home"></Tab.Pane>
          </Tab.Content>
        </Tab>

        <Tab eventKey="profile" title="Add Event">
          <Tab.Content>
            <Tab.Pane eventKey="profile"></Tab.Pane>
          </Tab.Content>
        </Tab>
      </Tabs>
      {activeTab === "home" && <UploadX />}
      {activeTab === "profile" && <Addevent />}
      {!showeditd && <Editpage data={id2} />}
      {!showdelete && <Deletepage data={id2} />}

      <>
        <h1 style={{ display: "flex", justifyContent: "center" }}>Event All</h1>
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>ชื่อกิจกรรม</th>
              <th>เวลาที่เปิดดูได้</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.attributes.name}</td>
                <td>
                  {new Date(item.attributes.datetime).toLocaleString("en-GB")}
                </td>
                <td>
                  <button
                    variant="danger"
                    className="mt-2"
                    onClick={() => handleDelete(item.id)}
                  >
                    <span style={{ fontWeight: "bold" }}>Delete</span>
                  </button>

                  <button
                    variant="danger"
                    className="mt-2"
                    onClick={() => handleEdit(item.id)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    </>
  );
};

export default CreateEntryForm;
