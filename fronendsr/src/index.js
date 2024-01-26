import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import StudentPage from "./PageAll/StudentPage";
import StaffPage from "./PageAll/StaffPage";
import Datapage from "./PageAll/Datapage";
import ViewPage from "./PageAll/ViewPage";
import AddPage from "./PageAll/AddPage";
import UploadX from "./PageAll/UploadX";
import Addevent from "./PageAll/Addevent";
import Editpage from "./PageAll/Editpage"
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/student",
    element: <StudentPage />,
  },
  {
    path: "/staff",
    element: <StaffPage />,
  },
  {
    path: "/datapage",
    element: <Datapage />,
  },
  {
    path: "/viewpage",
    element: <ViewPage />,
  },
  {
    path: "/addpage",
    element: <AddPage />,
  },
  {
    path: "/uploadx",
    element: <UploadX />,
  },
  {
    path: "/addevent",
    element: <Addevent />,
  },
  {
    path: "/editpage",
    element: <Editpage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
