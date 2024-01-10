// SimpleLoginForm.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate,useParams  } from "react-router-dom";
const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("350");
  const [password, setPassword] = useState("123456");
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitEnabled(false);

    try {
      let result = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: username,
        password: password,
      });

      //เก็บ jwt ในฟังก์ชั่นเพื่อเรียกใช้งานในหน้า component อื่น
      const saveTokenToLocalStorage = (token) => {
        localStorage.setItem("jwtToken", token); //เก็บ jwt token
      };
      saveTokenToLocalStorage(result.data.jwt);
      
      const saveNameToLocalStorage = (Namee) => {
        localStorage.setItem("myname", Namee); //เก็บ jwt token
      };
      saveNameToLocalStorage(result.data.user.username);
      console.log(result.data.user.username)
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      };

      //เช็ค role
      const userResult = await axios.get(
        "http://localhost:1337/api/users/me?populate=role",
        config
      );

      // Step 4: Check user's role and navigate accordingly
      if (userResult.data.role) {
        if (userResult.data.role.name === "student") {
          console.log(userResult.data.role.name);
          navigate("/datapage");
        }
        if (userResult.data.role.name === "staff") {
          console.log(userResult.data.role.name);
          navigate("/staff");
        }
      }

      console.log(userResult);
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
