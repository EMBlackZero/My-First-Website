// SimpleLoginForm.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Datapage from "./PageAll/Datapage";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("450");
  const [password, setPassword] = useState("123456");
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [jwt, setjwt] = Datapage("", "jwt");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  useEffect(() => {
    const fetchData = async () => {
      if (jwt !== "") {
        try {
          const result = await axios.get(
            "http://localhost:1337/api/users/me?populate=role"
          );
          if (result.data.role) {
            if (result.data.role.name === "student") {
              navigate("/student");
            } else if (result.data.role.name === "staff") {
              navigate("/staff");
            }
            console.log(result);
          }
        } catch (error) {
          console.log("Error fetching user data:", error);
        }
      }
    };

    fetchData();
  }, [jwt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitEnabled(false);

    try {
      let result = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: username,
        password: password,
      });
      setjwt(result.data.jwt);
      axios.defaults.headers.common = {
        Authorization: `Bearer ${result.data.jwt}`,
      };

      result = await axios.get(
        "http://localhost:1337/api/users/me?populate=role"
      );
      if (result.data.role) {
        if (result.data.role.name === "student") {
          navigate("/student");
        } else if (result.data.role.name === "staff") {
          navigate("/staff");
        }
        console.log(result);
      }
    } catch (e) {
      console.log(e);
      console.log("wrong username & password");
      setSubmitEnabled(true);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={handleUsernameChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={!submitEnabled}>
        Submit
      </Button>
    </Form>
  );
};

export default LoginForm;
