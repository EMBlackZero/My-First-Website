import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Datapage from "./Datapage";
import { Container, Card, Button } from "react-bootstrap";

function ViewPage() {
  const [selectedSculptor, setSelectedSculptor] = useState(null);
  const [events, setEvents] = useState([]);
  const [pass, setpass] = useState(true);
  const [jwt, setjwt] = Datapage("", "jwt");

  const fetchData = async (withAuthorization) => {
    try {
      axios.defaults.headers.common = withAuthorization
        ? { Authorization: `Bearer ${jwt}` }
        : {};

      const response = await axios.get("http://localhost:1337/api/events");
      setEvents(response.data.data);
    } catch (error) {
      console.log(
        withAuthorization
          ? "Error fetching data with Authorization:"
          : "Error fetching data:",
        error
      );
    }
  };

  useEffect(() => {
    fetchData(false);
  }, []);

  useEffect(() => {
    if (jwt) {
      fetchData(true);
    }
  }, [jwt]);
}

export default ViewPage;
