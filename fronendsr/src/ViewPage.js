import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Datapage from "./Datapage";
import { Container, Card, Button,Table  } from "react-bootstrap";
export default function ViewPage(props) {
  const Viewid = props.data;
  console.log('id',Viewid)
  const [views, setViews] = useState([]);
  const [jwt, setjwt] = Datapage("", "jwt");


  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>คะเเนน</th>
          <th>PASS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{Viewid.attributes.users_permissions_user.data.attributes.username}</td>
          <td>{Viewid.attributes.result}</td>
          <td>{Viewid.attributes.users_permissions_user.data.attributes.username}</td>
        </tr>
      </tbody>
    </Table>
  );
}
